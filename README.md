# password-validate
Security level and password confirmation with progress bar  
Validación de nivel de seguridad y confirmación de contraseña con barra de progreso

## Dependencies
* jQuery
* Bootstrap

## Usage

	<form method="post" action="" id="form-signin">
		<div class="form-group"> 
	    	<div class="col-sm-12"> 
	        	<input type="password" required="required" class="form-control password1"/> 
	        </div> 
	    </div>
		<div class="form-group"> 
	    	<div class="col-sm-12"> 
	        	<input type="password" required="required" class="form-control password2"/> 
		    </div>
		</div>
	</form>

	<script>
        jQuery(document).ready(function() {
            PasswordValidate.init({ 
                "input1":   ".password1", 
                "input2":   ".password2", 
                "form":     "#form_signin" 
            }); 
        });
    </script>

