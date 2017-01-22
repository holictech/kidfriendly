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
    initialize();

    vm.launchNavigator = function() {
      vm.showLoading();
      CompanyService.getGeolocation().then(function(response) {
        if (angular.isString(response)) {
          CompanyService.ionicPopupAlertAttention(response);
        } else {
          if (angular.isObject(vm.company.address)) {
            var destination = [vm.company.address.numLatitude, vm.company.address.numLongitude];
            var start = [response.latitude, response.longitude];

            launchnavigator.navigate(destination, {
              'start': start,
              'appSelectionDialogHeader': 'Selecione o aplicativo para navegação.',
              'appSelectionCancelButton': 'Cancelar'
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
          if (angular.isObject(response) && angular.isArray(response) && response.length !== 0) {
            vm.images = response;
            vm.timeoutHideLoading();
            openGallery();
          } else {
            vm.hideLoading();

            if (angular.isString(response)) {
              ImageService.ionicPopupAlertError(response);
            } else {
              ImageService.ionicPopupAlertAttention('Nenhuma imagem encontrada.');
            }
          }
        });
      } else {
        openGallery();
      }
    };

    vm.closeGallery = function() {
      vm.gallery.hide();
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
        if (angular.isString(response)) {
          vm.hideLoading();
          RatingService.ionicPopupAlertError(response);
        } else {
          paginatorDto = response.paginatorDto;
          vm.ratings = vm.ratings.concat(response.results);
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

        if (CompanyService.isObject(company)) {
          CompanyService.details(company.idCompany, idCategory).then(function(response) {
            if (angular.isString(response)) {
              vm.hideLoading();
              CompanyService.ionicPopupAlertError(response).then(function() {
                vm.goBack();
              });
            } else {
              paginatorDto = response.ratings.paginatorDto;
              vm.company = response.company;
              vm.address = getAddress(vm.company);
              vm.ratings = response.ratings.results;
              vm.characteristics = response.characteristics;
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
        scope: $scope
      }).then(function(modal) {
        var stopListening = $scope.$on('modal.hidden', function() {
          stopListening();
          vm.gallery.remove();
        });
        vm.gallery = modal;
        vm.gallery.show().then(function() {
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
