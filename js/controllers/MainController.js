// js/controllers/MainController.js
(function() {
    'use strict';

    angular
        .module('tiendaApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'ProductService'];

    function MainController($scope, ProductService) {

        // Variables principales
        $scope.allProducts = [];
        $scope.displayProducts = [];
        $scope.cart = [];
        $scope.cartTotal = 0;

        // Variables para persona 5
        $scope.subtotal = 0;
        $scope.impuesto = 0;
        $scope.productoAgregado = null;

        // Modales
        $scope.showDetailsModal = false;
        $scope.showCartModal = false;
        $scope.selectedProduct = null;
        
        $scope.mostrarCarritoFlotante = false;

        // Detectar scroll para mostrar carrito flotante
        angular.element(window).on('scroll', function() {
            var scroll = window.pageYOffset || document.documentElement.scrollTop;
            $scope.$apply(function() {
                $scope.mostrarCarritoFlotante = scroll > 200;
            });
        });

        // Categorías
        $scope.categories = [];
        $scope.selectedCategory = "";
        $scope.searchText = "";

        // Modales
        $scope.showDetailsModal = false;
        $scope.showCartModal = false;
        $scope.selectedProduct = null;

        // Obtener categorías únicas
        function getUniqueCategories(products) {
            var set = new Set();
            products.forEach(function(p) {
                if (p.category) {
                    set.add(p.category);
                }
            });
            return Array.from(set);
        }

        // Calcular subtotal
        function calcularSubtotal() {
            var sub = 0;
            for(var i = 0; i < $scope.cart.length; i++) {
                sub += $scope.cart[i].price * $scope.cart[i].quantity;
            }
            return sub;
        }

        // Calcular impuesto (13%)
        function calcularImpuesto(subtotal) {
            return subtotal * 0.13;
        }

        // Actualizar totales
        function actualizarTotales() {
            $scope.subtotal = calcularSubtotal();
            $scope.impuesto = calcularImpuesto($scope.subtotal);
            $scope.cartTotal = $scope.subtotal + $scope.impuesto;
        }

        // Cargar productos de la API
        ProductService.getAllProducts().then(function(products) {
            $scope.allProducts = products;
            $scope.displayProducts = products;
            $scope.categories = getUniqueCategories(products);
        });

        // Cargar carrito desde localStorage
        $scope.cart = ProductService.getCart() || [];
        actualizarTotales();

        // Filtrar por categoría
        $scope.filterByCategory = function() {
            $scope.applyFilters();
        };

        // Aplicar filtros
        $scope.applyFilters = function() {
            var list = $scope.allProducts;

            if ($scope.selectedCategory && $scope.selectedCategory !== "") {
                list = list.filter(function(p) {
                    return p.category === $scope.selectedCategory;
                });
            }

            if ($scope.searchText && $scope.searchText.trim() !== "") {
                var text = $scope.searchText.toLowerCase();
                list = list.filter(function(p) {
                    return p.title.toLowerCase().indexOf(text) !== -1;
                });
            }

            $scope.displayProducts = list;
        };

        // Abrir detalles
        $scope.openDetails = function(product) {
            $scope.selectedProduct = product;
            $scope.showDetailsModal = true;
        };

        // Abrir modal del carrito
        $scope.openCartModal = function() {
            actualizarTotales();
            $scope.showCartModal = true;
        };

        // Agregar al carrito
        $scope.updateCart = function(product) {
            var existe = false;
            
            for(var i = 0; i < $scope.cart.length; i++) {
                if($scope.cart[i].id === product.id) {
                    $scope.cart[i].quantity++;
                    existe = true;
                    break;
                }
            }

            if(!existe) {
                $scope.cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: 1
                });
            }

            ProductService.saveCart($scope.cart);
            actualizarTotales();
            
            // Efecto visual
            $scope.productoAgregado = product.id;
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.productoAgregado = null;
                });
            }, 500);
        };

        // Eliminar producto del carrito
        $scope.eliminarProducto = function(index) {
            $scope.cart.splice(index, 1);
            ProductService.saveCart($scope.cart);
            actualizarTotales();
        };

        // Procesar pago
        $scope.procesarPago = function() {
            if($scope.cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }

            alert('¡Compra realizada con éxito!\nTotal pagado: $' + $scope.cartTotal.toFixed(2));
            
            $scope.cart = [];
            ProductService.clearCart();
            actualizarTotales();
            $scope.showCartModal = false;
        };

        // Cerrar modales
        $scope.closeModals = function() {
            $scope.showDetailsModal = false;
            $scope.showCartModal = false;
        };
    }

})();