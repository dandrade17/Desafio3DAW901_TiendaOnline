// js/services/ProductService.js
(function() {
    'use strict';
    
    angular
        .module('tiendaApp')
        .factory('ProductService', ProductService);

    // Inyección de dependencias para $http (consumo de API)
    ProductService.$inject = ['$http']; 

    function ProductService($http) {
        // Nombre de la clave en localStorage para guardar el carrito 
        var localStorageKey = 'tiendaCarrito'; 
        
        var service = {
            getAllProducts: getAllProducts,
            getCart: getCart,
            saveCart: saveCart,
            clearCart: clearCart
        };

        return service;

        // Consumir los datos de https://fakestoreapi.com/ [cite: 45]
        function getAllProducts() {
            return $http.get('https://fakestoreapi.com/products')
                .then(successCallback)
                .catch(errorCallback);
        }

        function successCallback(response) {
            return response.data;
        }
        
        // Manejo de errores de la API (Validación básica)
        function errorCallback(error) {
            console.error('Error al consumir la API de productos:', error);
            // lanzar un error o retornar un array vacío si falla
            return [];
        }

        // --- FUNCIONES DE LOCALSTORAGE ---

        // Obtiene los datos del carrito del cliente desde el localStorage 
        function getCart() {
            var cartData = localStorage.getItem(localStorageKey);
            // Retorna el carrito o un array vacío si no existe
            return cartData ? JSON.parse(cartData) : [];
        }

        // Guarda el estado actual del carrito en localStorage 
        function saveCart(cart) {
            // Usar JSON.stringify para guardar el objeto/array como string
            localStorage.setItem(localStorageKey, JSON.stringify(cart));
        }
        
        // Limpia el carrito (Usado después de "Pagar")
        function clearCart() {
            localStorage.removeItem(localStorageKey);
        }
    }
})();