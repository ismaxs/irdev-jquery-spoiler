/** 
	----------------------------------------------------------
	Plugin para creacion de spoilers personalizables

				Autor: 		Ismael Rodriguez # IRDEV
				Version: 	v0.3 alpha # 14-04-2013
				Licencia: 	MIT
				Contacto: 	ismaxs@gmail.com
				Info: 		www.irdev.com
	----------------------------------------------------------
*/
(function($){

	var plugin = {};

	var defaults = {
		// GENERAL
		controllerType: 'text',
		controllerSelectorID: null,
		controllerCssClass: null,
		openEasing: '',
		closeEasing: '',
		openDuration: 500,
		closeDuration: 500,
		textShow: 'show spoiler',
		textHide: 'close spoiler',
		iconShow: 'img/show.png',
		iconHide: 'img/hide.png',
		initVisible: true,

		// CALLBACKS
		onSpoilerShowInit: function() {},
		onSpoilerShowEnd: function() {},
		onSpoilerHideInit: function() {},
		onSpoilerHideEnd: function() {}
	}

	$.fn.irSpoiler = function(options){

		if(this.length == 0) return this;

		// soporte para multiples elementos (instancias del plugin)
		if(this.length > 1){
			this.each(function(){$(this).irSpoiler(options)});
			return this;
		}

		// creamos un namespace que sera usado por el plugin
		var spoiler = {};
		// establecemos una referencia al elemento spoiler
		var el = this;
		plugin.el = this;

		/**
		 * ===================================================================================
		 * = FUNCIONES PRIVADAS
		 * ===================================================================================
		 */

		 /**
		 * Inicializa el namespace con las opciones que serán usadas por el plugin
		 */
		var init = function(){
			// mezclamos las opciones por defecto con las opciones del user
			spoiler.settings = $.extend({}, defaults, options);

			// Modificaciones en DOM & CSS
			setup();
		}

		/**
		 * Modificaciones en DOM & CSS
		 */
		var setup = function() {
			// creamos y añadimos el controlador del spoiler
			if (spoiler.settings.controllerType === 'text') {
				// Tipo texto
				spoiler.control = $("<p></p>");
			} else {
				// Tipo icono
				spoiler.control = $("<img src='' />");
			}
			// Comprobamos donde debemos colocar el controlador
			if (spoiler.settings.controllerSelectorID != null) {
				spoiler.control.append(spoiler.settings.controllerSelectorID);
			} else {
				spoiler.control.insertBefore(el);
			}
			// Asignamos los eventos al controlador
			spoiler.control.bind('click', clickControl);
			// Comprobamos si el spoiler debe ser visible al inicio
			if (!spoiler.settings.initVisible) {
				// Escondemos el contenedor
				el.hide();
				// Tipo de control
				if (spoiler.settings.controllerType === 'text') {
					// Asignamos el texto de mostrado
					spoiler.control.text(spoiler.settings.textShow);
				} else {
					// Asignamos el icono de mostrado
					spoiler.control.attr("src", spoiler.settings.iconShow);
				}
			} else {
				// Tipo de control
				if (spoiler.settings.controllerType === 'text') {
					// Asignamos el texto de ocultado
					spoiler.control.text(spoiler.settings.textHide);
				} else {
					// Asignamos el icono de mostrado
					spoiler.control.attr("src", spoiler.settings.iconHide);
				}
			}
			// Estilo del controlador
			setControllerStyle();
		}

		/**
		 * Establece el CSS para el controlador
		 */
		var setControllerStyle = function() {
			// Comprobamos si asignaron una clase css
			if (spoiler.settings.controllerCssClass != null) {
				// Asignamos la clase
				spoiler.control.addClass(spoiler.settings.controllerCssClass);
			} else {
				// Asignamos la clase por defecto segun el tipo de controlador
				if (spoiler.settings.controllerType === 'text') {
					spoiler.control.addClass('spoilerText');
				} else {
					spoiler.control.addClass('spoilerIcon');
				}
			}
		}

		/**
		 * Click en el control del spoiler
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickControl = function(e) {
			if (el.is(':visible')) {
				// OCULTAMOS
				// on Init
				spoiler.settings.onSpoilerHideInit();
				// Comprobamos el tipo de animacion
				if (spoiler.settings.closeEasing === "slide") {
					el.slideUp(spoiler.settings.closeDuration, spoiler.settings.onSpoilerHideEnd);
				} else if (spoiler.settings.closeEasing === "fade") {
					el.fadeOut(spoiler.settings.closeDuration, spoiler.settings.onSpoilerHideEnd);
				} else {
					el.hide(spoiler.settings.closeDuration, spoiler.settings.onSpoilerHideEnd);
				}
				if (spoiler.settings.controllerType === 'text'){
					spoiler.control.text(spoiler.settings.textShow);
				} else {
					// TODO icon
				}
					
			} else {
				// MOSTRAMOS
				// on Init
				spoiler.settings.onSpoilerShowInit();
				// Comprobamos el tipo de animacion
				if (spoiler.settings.openEasing === "slide") {
					el.slideDown(spoiler.settings.openDuration, spoiler.settings.onSpoilerShowEnd);
				} else if (spoiler.settings.openEasing === "fade") {
					el.fadeIn(spoiler.settings.openDuration, spoiler.settings.onSpoilerShowEnd);
				} else {
					el.show(spoiler.settings.openDuration, spoiler.settings.onSpoilerShowEnd);
				}
				if (spoiler.settings.controllerType === 'text'){
					spoiler.control.text(spoiler.settings.textHide);
				} else {
					// TODO icon
				}
			}
			e.preventDefault();
		}

		/**
		 * ===================================================================================
		 * = FUNCIONES PUBLICAS
		 * ===================================================================================
		 */
		
		/**
		 * Muestra el contenido del spoiler
		 *
		 * @param useSettings (boolean) 
		 *  - si true, utiliza la configuracion establecida previamente al componente
		 */
		el.showNow = function(useSettings){
			if (useSettings) {
				spoiler.control.trigger("click");
			} else {
				el.show();
				if (spoiler.settings.controllerType === 'text'){
					spoiler.control.text(spoiler.settings.textHide);
				} else {
					// TODO icon
				}
			}
		}

		/**
		 * Oculta el contenido del spoiler
		 *
		 * @param useSettings (boolean) 
		 *  - si true, utiliza la configuracion establecida previamente al componente
		 */
		el.hideNow = function(useSettings){
			if (useSettings) {
				spoiler.control.trigger("click");
			} else {
				if (spoiler.settings.controllerType === 'text'){
					spoiler.control.text(spoiler.settings.textShow);
				} else {
					// TODO icon
				}
				el.hide();
			}
		}

		init();
		
		// devolvemos el objeto jQuery actual
		return this;
	}
})(jQuery);