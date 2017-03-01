(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);
  CompanyController.$inject = ['CompanyService', '$scope', '$state', '$controller', 'maskFilter', 'RatingService', '$ionicModal', 'ImageService'];

  function CompanyController(CompanyService, $scope, $state, $controller, maskFilter, RatingService, $ionicModal, ImageService) {
    var vm = this;
    var paginatorDto = null;
    var idCompany = null;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.company = {};
    vm.address = null;
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    vm.ratings = [];
    vm.images = [];
    vm.isInfiniteScroll = false;
    vm.isVisible = false;
    vm.rating = {};
    initialize();

    vm.launchNavigator = function() {
      vm.showLoading();
      CompanyService.getGeolocation().then(function(response) {
        if (response.error) {
          CompanyService.ionicPopupAlertAttention(response.message);
        } else {
          if (angular.isObject(vm.company.address) && angular.isDefined(launchnavigator)) {
            var destination = '' + vm.company.address.numLatitude + ', ' + vm.company.address.numLongitude + '';
            var start = '' + response.data.latitude + ', ' + response.data.longitude + '';

            launchnavigator.navigate(destination, {
              'start': start,
              'appSelectionDialogHeader': 'Selecione o aplicativo para navegação.',
              'appSelectionCancelButton': 'Cancelar',
              'appSelectionList': [launchnavigator.APP.GOOGLE_MAPS, launchnavigator.APP.APPLE_MAPS, launchnavigator.APP.WAZE]
            });
          }
        }

        vm.hideLoading();
      });
    };

    vm.showGallery = function () {
      if ((!angular.isDefined(idCompany) || idCompany !== vm.company.idCompany || vm.images.length === 0)) {
        idCompany = vm.company.idCompany;
        vm.images = [];
        vm.showLoading();
        ImageService.listByCompany(idCompany).then(function(response) {
          if (!response.error) {
            if (response.data.length !== 0) {
              vm.images = response.data;
              vm.timeoutHideLoading();
              openGallery();
            } else {
              vm.hideLoading();
              ImageService.ionicPopupAlertAttention('Ainda não temos nenhuma imagem na galeria.');
            }
          } else {
            vm.hideLoading();
            ImageService.ionicPopupAlertError(response.message);
          }
        });
      } else {
        openGallery();
      }
    };

    vm.closeGallery = function() {
      vm.modalGallery.hide();
    };

    vm.showRating = function() {
      //implementar a regra que verifica se o usuário está logado e está no prazo para efetuar um novo comentário
      vm.rating = {};
      vm.showLoading();
      RatingService.hasPermission(vm.company.idCompany, 1).then(function(response) {
        if (response.error) {
          vm.hideLoading();
          RatingService.ionicPopupAlertError(response.message);
        } else if (response.data) {
          openRating();
          vm.timeoutHideLoading();
        } else {
          vm.hideLoading();
          RatingService.ionicPopupAlertAttention('Você avaliou este estabelecimento a menos de um mês.');
        }
      });
    };

    vm.closeRating = function() {
      vm.modalRating.hide();
    };

    vm.selectedStatusRating = function(event, idStatusKidFriendly) {
      vm.rating.statusKidFriendly = {'idStatusKidFriendly': idStatusKidFriendly};

      angular.forEach(document.querySelectorAll('.kf-rating-icon-rate'), function(value, key) {
        angular.element(value)[0].classList.remove('kf-rating-icon-rate-active');
      });

      event.srcElement.classList.add('kf-rating-icon-rate-active');
    };

    vm.includeRating = function() {
      if (angular.isUndefined(vm.rating.statusKidFriendly)) {
        RatingService.ionicPopupAlertAttention('Para avaliar, é necessário que você escolha uma das quatros opções que representa sua experiência no local.');
        return;
      } else if (vm.formRating.desRating.$error.required) {
        RatingService.ionicPopupAlertAttention('Para avaliar, é necessário que você faça um comentário.');
        return;
      }

      vm.rating.company = {'idCompany': vm.company.idCompany};
      vm.rating.user = {'idUser': 1};//pegar a informação do usuario logado.
      vm.showLoading();
      RatingService.include(vm.rating).then(function(response) {
        vm.hideLoading();

        if (response.error) {
          RatingService.ionicPopupAlertError(response.message);
        } else {
          RatingService.ionicPopupAlertSuccess().then(function() {
            vm.closeRating();
          });
        }
      });
    };

    vm.getFirstLastName = function(name) {
      var strName = '';
      name = name.split(' ');
      strName = name[0] + ' ' + ((name.length > 1) ? name[name.length - 1] : '');

      return strName;
    };

    vm.infiniteScroll = function() {
      var params = {
        'currentPage': paginatorDto.currentPage + 1,
        'pageSize': paginatorDto.pageSize
      };
      vm.showLoading();
      RatingService.listByCompany(vm.company.idCompany, params).then(function(response) {
        if (response.error) {
          vm.hideLoading();
          RatingService.ionicPopupAlertError(response.message);
        } else {
          paginatorDto = response.data.paginatorDto;
          vm.ratings = vm.ratings.concat(response.data.results);
          vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
          vm.timeoutHideLoading();
        }
      }).finally(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function () {
        vm.isVisible = false;
        var company = $state.params.params.company;
        var idCategory = $state.params.params.idCategory;

        if (angular.isObject(company)) {
          CompanyService.details(company.idCompany, idCategory).then(function(response) {
            if (response.error) {
              vm.hideLoading();
              CompanyService.ionicPopupAlertError(response.message).then(function() {
                vm.goBack();
              });
            } else {
              paginatorDto = response.data.ratings.paginatorDto;
              vm.company = response.data.company;
              vm.address = getAddress(vm.company);
              vm.ratings = response.data.ratings.results;
              vm.characteristics = response.data.characteristics;
              vm.halfCharacteristics = vm.characteristics.splice(Math.ceil((vm.characteristics.length / 2)));
              vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
              vm.isVisible = true;
              vm.timeoutHideLoading();
            }
          });
        }
      });
    }

    function getAddress(company) {
      var address = '';

      if (angular.isObject(company.address)) {
        address += company.address.desStreet;
        address += (company.address.numStreet !== null) ? ', ' + company.address.numStreet : '';
        address += (company.address.desComplement !== null) ? ', ' + company.address.desComplement : '';
        address += (company.address.desNeighborhood !== null) ? ', ' + company.address.desNeighborhood : '';
        address += ' - ' + maskFilter(company.address.descCode, '00000-000');
        address += ' - ' + company.address.city.desCity + '/' + company.address.city.state.desSigla;
      }

      return address;
    }

    function openGallery() {
      $ionicModal.fromTemplateUrl('app/view/company/gallery.html', {
        scope: $scope,
        animation: 'kf-slide-in-down'
      }).then(function(modal) {
        var stopListeningGallery = $scope.$on('modal.hidden', function() {
          stopListeningGallery();
          vm.modalGallery.remove();
        });
        vm.modalGallery = modal;
        vm.modalGallery.show().then(function() {
          var galleryTop = new ionic.views.Swiper(angular.element(document.querySelector('.kf-gallery-top')), {
            spaceBetween: 5,
            preloadImages: false,
            lazyLoading: true
          });
          var galleryThumbs = new ionic.views.Swiper(angular.element(document.querySelector('.kf-gallery-thumbs')), {
            spaceBetween: 5,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true
          });
          galleryTop.params.control = galleryThumbs;
          galleryThumbs.params.control = galleryTop;
        });
      });
    }

    function openRating() {
      $ionicModal.fromTemplateUrl('app/view/company/rating.html', {
        scope: $scope,
        animation: 'kf-slide-in-down'
      }).then(function(modal) {
        var stopListeningRating = $scope.$on('modal.hidden', function() {
          stopListeningRating();
          vm.modalRating.remove();
        });
        vm.modalRating = modal;
        vm.modalRating.show();
      });
    }
  }

  angular.module('kidfriendly').directive('kfScrollHeigth', ScrollHeigth);
  ScrollHeigth.$inject = ['$window'];

  function ScrollHeigth($window) {
      return {
        restrict: 'A',
        link: function(scope, element, attributes, controllers) {
          scope.onResize = function() {
            var menu = angular.element(document.querySelector('#menu'))[0];
            var scrollRating = angular.element(document.querySelector('#scrollRating'))[0];
            var footer = angular.element(document.querySelector('.bar-footer'))[0];
            element.css('max-height', (footer.offsetTop - (scrollRating.offsetTop + (scrollRating.offsetTop - menu.offsetTop))) - 15 + 'px');
          };

          scope.onResize();
        }
      };
    }
})();
