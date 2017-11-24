function cargarContactos(){
	if (!localStorage.getItem('idUsuario')) {
		window.location.assign('login.html');
	}
	crearContactos();
}

function crearContactos(){
	document.querySelector('section').style.opacity="1";
	document.querySelector('h1').style.opacity="1";
	document.querySelector('i').style.opacity="1";


	contactosAjax = new XMLHttpRequest();
	contactosAjax.open('GET', 'http://148.220.211.95:88/apps2017/sesion3/php/contactos.php');
	contactosAjax.send();
	contactosAjax.onreadystatechange = function(){
		if (contactosAjax.readyState == 4 && contactosAjax.status == 200) {
			contacto = JSON.parse(contactosAjax.responseText);
			console.log(contacto);
			for (i = 0; i < contacto.length; i++) {

				if (contacto[i].id != localStorage.getItem('idUsuario')) {
									
					div=
					"<div class='contacto oculto' onclick='verChat(this.id)' id='"+contacto[i].id+"'>"+

					"<div class='contacto-img'>"+
						"<img src='"+contacto[i].foto+"'>"+
					"</div>"+

					"<div class='contacto-nombre'>"+
						contacto[i].nombre+
					"</div>"+

					"<div class='contacto-estado'>"+
						contacto[i].estado+
					"</div>"+

					"</div>";

					document.querySelector('section').innerHTML += div;
				}
			}
				contactos=document.querySelectorAll('.contacto');
				i=0;
				animacionContactos();
		}
	}
}

function verChat(id){
	localStorage.setItem('idChat', id);
	document.getElementById('circulo').classList.add('full');
	setTimeout(function(){
		window.location.assign('chat.html');
	}, 1000);
	
}

function animacionContactos(){
	if (i<contactos.length) {
			contactos[i].classList.remove('oculto')
			i++
		setTimeout(function(){
			animacionContactos();
		},300)
	}
}

function enviarMsj(){	
	mensaje = document.getElementById('mensaje').value;

	if (mensaje != "") {
		bandeja = document.querySelector('article');
		bandeja.innerHTML += "<div class='msj saliente escondido'>"+mensaje+"</div>";

		setTimeout(function(){
			document.querySelector('.escondido').classList.remove('escondido');
		},100);
		document.getElementById('mensaje').value="";


		idSaliente = localStorage.getItem('idUsuario');
		idEntrante = localStorage.getItem('idChat');
		enviarAjax = new XMLHttpRequest();
		enviarAjax.open('GET', 'http://148.220.211.95:88/apps2017/sesion3/php/mensaje.php?idS='+idSaliente+'&idE='+idEntrante+"&msj="+mensaje);
		enviarAjax.send();
		enviarAjax.onreadystatechange = function(){
			if (enviarAjax.readyState == 4 && enviarAjax.status == 200) {
				console.log('Enviado!');
			}
		}
	}else{
		navigator.vibrate('300');
	}	
}

function cargarChat(){
	document.getElementById('circulo').classList.remove('full');
	idSaliente = localStorage.getItem('idUsuario');
	idEntrante = localStorage.getItem('idChat');
	cargarAjax = new XMLHttpRequest();
	cargarAjax.open('GET', 'http://148.220.211.95:88/APPS2017/SESION3/php/chat.php?idS='+idSaliente+'&idE='+idEntrante);
	cargarAjax.send();
	cargarAjax.onreadystatechange = function(){
		if (cargarAjax.readyState == 4 && cargarAjax.status == 200) {
			mensajes = JSON.parse(cargarAjax.responseText);
			document.getElementById('nombre').innerHTML = mensajes[mensajes.length-1].nombre;
			document.getElementById('foto').src=mensajes[mensajes.length-1].foto; 
			ultimoMensaje = mensajes.length - 1;
			for(i = 0; i < mensajes.length-1; i++){
				bandeja = document.querySelector('article');
				if (mensajes[i].lado == "entrante") {
					bandeja.innerHTML += "<div class='msj entrante'>"+mensajes[i].mensaje+"</div>"
				}else{
					bandeja.innerHTML += "<div class='msj saliente'>"+mensajes[i].mensaje+"</div>"
				}
			}
			longPollingChat();
		}
	}
}

function longPollingChat(){
	ultimoAjax = new XMLHttpRequest();
	ultimoAjax.open('GET', 'http://148.220.211.95:88/APPS2017/SESION3/php/ultimoMensaje.php?idE='+idEntrante+'&idS='+idSaliente+'&ultimo='+ultimoMensaje);
	ultimoAjax.send();
	ultimoAjax.onreadystatechange = function(){
		if(ultimoAjax.status == 200 && ultimoAjax.readyState == 4){
			ultimoJSON = JSON.parse(ultimoAjax.responseText);
			if(ultimoJSON.nuevo == "si"){
				if(ultimoJSON.lado == "entrante"){
					bandeja.innerHTML+="<div class='msj entrante'>"+ ultimoJSON.mensaje + "</div>";
				}
				ultimoMensaje++;
			}
		}
	}
	bandeja.scrollTop = bandeja.scrollHeight;
	setTimeout(function(){
		longPollingChat()
	},500)
}

function regresar(){
	document.querySelector('article').style.opacity="0";
	document.querySelector('article').style.transition=".5s all";

	document.querySelector('.fa').style.opacity="0";
	document.querySelector('.fa').style.transition=".5s all";

	document.querySelector('#foto').style.opacity="0";	
	document.querySelector('#foto').style.transition=".5s all";	

	document.querySelector('#nombre').style.opacity="0";
	document.querySelector('#nombre').style.transition=".5s all";

	document.querySelector('footer').style.opacity="0";
	document.querySelector('footer').style.transition=".5s all";

	setTimeout(function(){
		window.location.assign('index.html');

	},1000)
}