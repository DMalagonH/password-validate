/**
 * Validación de nivel de seguridad y confirmación de contraseña con barra de progreso
 * 
 * Date: 2015-06-10
 * 
 * @author Diego Malagon <diegomalagonh@gmail.com>
 */
var PasswordValidate = (function(){
    
    var settings;
    
    var minLength = 6;
    var level = 0;
    var maxLevel = 6;
    
    var progress_container_tmpl = '<div class="progress" style="height:5px;margin-bottom:0px;"></div>';
    var progress_tmpl = '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>';
    var $form;
    var $input1;
    var $input2;
    var $progress1;
    var $progress2;
    
    var css = {
        danger: "progress-bar-danger",
        warning: "progress-bar-warning",
        info: "progress-bar-info",
        success: "progress-bar-success"
    };
    
    /**
     * Funcion para inicializar el plugin
     * 
     * @param {Object} s
     * @returns {undefined}
     */
    var init = function(s){        
        settings = s;
        
        $input1 = $(settings.input1);
        $input2 = $(settings.input2);
        
        if(settings.form !== undefined){
            $form = $(settings.form);
        }
        
        createProgress();
        initEventListeners();
    };
    
    /**
     * Funcion para asignar los event listeners
     * 
     * @returns {undefined}
     */
    var initEventListeners = function(){
        $input1.on('keyup', writePasswordHandler);
        $input2.on('keyup', writeConfirmationHandler);
        $form.on("submit", submitHandler);
    };
    
    /**
     * Funcion que agrega barras de progreso debajo de los inputs para contraseña
     * 
     * @returns {undefined}
     */
    var createProgress = function(){
        
        $progress1 = $(progress_tmpl);
        $progress2 = $(progress_tmpl);
        
        //$progress1.removeClass("progress-bar-success progress-bar-info progress-bar-warning progress-bar-danger");
        
        // Estilos por defecto
        $progress1.css("width", "1%").addClass(css.danger);
        $progress2.css("width", "100%").addClass(css.danger);
        
        var $progress_container1 = $(progress_container_tmpl);
        var $progress_container2 = $(progress_container_tmpl);
        
        //Agregar progress al formulario
        $progress_container1.append($progress1).appendTo($input1.parent());
        $progress_container2.append($progress2).appendTo($input2.parent());
    };
    
    /**
     * handler al escribir la contraseña
     * 
     * @returns {undefined}
     */
    var writePasswordHandler = function(){
        
        var level = getPassLevel($input1.val());
        var perc = (level * 100) / maxLevel;
        var css_class = getCssLevel(perc);
        
        // Asignar estilos a la barra de progreso
        $progress1
            .css("width", perc + "%")
            .removeClass(css.danger + " " + css.warning + " " + css.info + " " + css.success)
            .addClass(css_class);
        
        // comparar passwords       
        comparePasswords();
        
    };
    
    /**
     * handler al escribir la confirmacion de contraseña
     * 
     * @returns {undefined}
     */
    var writeConfirmationHandler = function(){
        comparePasswords();
    };
    
    /**
     * Handler para submit de formulario con contraseñas
     * 
     * @param {type} e
     * @returns {Boolean}
     */
    var submitHandler = function(e){
        
        var val1 = $input1.val();
        var val2 = $input2.val();
        
        var validate = validatePassword(val1);
        
        if(validate && (val1 === val2)){
            return true;
        }
        else{
            e.preventDefault();
            
            if(!validate) { 
                Channeldir.displayNotice("error", {title: Translator.trans("contrasena.incorrecta"), detail: Translator.trans("contrasena.nivel.seguridad.bajo.no.coinciden") }); 
            }
            else if(val1 !== val2) { 
                Channeldir.displayNotice("error", {title: Translator.trans("contrasena.incorrecta"), detail: Translator.trans("contrasena.nivel.seguridad.bajo") }); 
            }
            
            // Necesario para resetear el btn del submit 
            setTimeout(function(){ $('#submit').button('reset'); }, 300); 
        }
    };
    
    /**
     * Funcion que compara las contraseñas y refleja el resultado en el progress de confirmacion
     * 
     * @returns {undefined}
     */
    var comparePasswords = function(){
        
        var val1 = $input1.val();
        var val2 = $input2.val();
        
        if(val1 !== '' && (val1 === val2) ){
            // Asignar estilos a la barra de progreso de confirmacion
            $progress2
                .removeClass(css.danger + " " + css.warning + " " + css.info + " " + css.success)
                .addClass(css.success);
        }
        else{
            // Asignar estilos a la barra de progreso de confirmacion
            $progress2
                .removeClass(css.danger + " " + css.warning + " " + css.info + " " + css.success)
                .addClass(css.danger);
        }
    };
    
    /**
     * Funcion para validar el password al hacer submit
     * 
     * @param {String} password
     * @param {String} confirmation
     * @returns {Boolean}
     */
    var validatePassword = function(password){
        var level = getPassLevel(password);
        if(level >= 4){
            return true;
        }
        
        return false;
    };
        
    /**
     * Funcion que obtiene el estilo css del progress segun el nivel del password
     * 
     * @param {Integer} percent
     * @returns {css.info|css.success|css.danger|css.warning}
     */
    var getCssLevel = function(percent){
        var css_class;
        
        if(percent < 34) css_class = css.danger;//rojo
        else if(percent >= 34 && percent < 66) css_class = css.warning;
        else if(percent >= 66 && percent < 90) css_class = css.info;
        else if(percent >= 90) css_class = css.success;
        
        return css_class;
    };
    
    /**
     * Funcion para validar el nivel de seguridad de una contraseña
     * 
     * @param {String} pass
     * @returns {Number}
     */
    var getPassLevel = function(pass){
        
        level = 0;
        
        if(pass.length >= minLength)
        {
            level += 1;
            if(pass.match('[a-z]') && pass.match('[A-Z]'))
            {
                level += 1;
            }
            if(pass.match('[0-9]') && (pass.match('[a-z]') || pass.match('[A-Z]')))
            {
                level += 1;
            }
            if(pass.match('[`,´,~,!,@,#,$,&,%, ,^,(,),+,=,{,},[,\\],|,-,_,/,*,$,=,°,¡,?,¿,\\,/,,.,;,:,",\',<,>]') && (pass.match('[a-z]') || pass.match('[A-Z]')))
            {
                level += 1;
            }
            if(pass.length >= minLength+2)
            {
                level += 1;
            }
            if(pass.length >= minLength+4)
            {
                level += 1;
            }  
        }
        else if(pass.length >= 1)
        {
            level += 0.5;
        }
        else
        {
            level += 0.05;
        }

        return level;
    };
    
    return {
        init: init,
        validatePassword: validatePassword
    };
    
}());