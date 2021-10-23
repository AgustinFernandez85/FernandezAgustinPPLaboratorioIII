function $(id) {
    return document.getElementById(id);
}

var listaPersonas;
var idPersona;
var id;
function cerrar(){
    let cuadro = document.getElementsByClassName("cuadro-modal");
    cuadro[0].hidden = true;
}

function cargarUsuarios() {
    document.getElementById("spinner").hidden = false;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let respuesta = JSON.parse(this.response);
            listaPersonas = respuesta;
            console.log(respuesta);
            var body = document.getElementsByTagName("body")[0];

            var tabla = document.createElement("table");
            var tblBody = document.createElement("tbody");
            var tblHead = document.createElement("thead");

            for (var i = 0; i < listaPersonas.length; i++) {
                if (i == 0) {
                    var row = document.createElement("tr");
                    for (var z = 0; z < 4; z++) {
                        var tablaData = document.createElement("th");
                        switch (z) {
                            case 0:
                                var textoCelda = document.createTextNode("Nombre");
                                break;
                            case 1:
                                var textoCelda = document.createTextNode("Apellido");
                                break;
                            case 2:
                                var textoCelda = document.createTextNode("Localidad");
                                break;
                            case 3:
                                var textoCelda = document.createTextNode("Sexo");
                                break;
                        }
                        tablaData.appendChild(textoCelda);
                        row.appendChild(tablaData);
                    }
                    tblHead.appendChild(row);
                }
                var hilera = document.createElement("tr");

                for (var j = 0; j < 4; j++) {
                    var celda = document.createElement("td");
                    switch (j) {
                        case 0:
                            var textoCelda = document.createTextNode(listaPersonas[i].nombre);
                            break;
                        case 1:
                            var textoCelda = document.createTextNode(listaPersonas[i].apellido);
                            break;
                        case 2:
                            var textoCelda = document.createTextNode(listaPersonas[i].localidad.nombre);
                            break;
                        case 3:
                            var textoCelda = document.createTextNode(listaPersonas[i].sexo);
                            break;
                    }
                    celda.appendChild(textoCelda);
                    hilera.appendChild(celda);
                }
                if(i % 2 != 0){
                    hilera.className = "colorPar";
                }
                tblBody.appendChild(hilera);
                hilera.addEventListener("click",cuadroModal);
            }

            tabla.appendChild(tblHead);
            tabla.appendChild(tblBody);
            body.appendChild(tabla);

            tabla.className = "prueba";
            document.getElementById("spinner").hidden = true;
            
        }
    };
    xhttp.open("GET", "http://localhost:3000/personas", true, "usuario", "pass");
    xhttp.send();
}

function cuadroModal(event){
    let cuadro = document.getElementsByClassName("cuadro-modal");
    cuadro[0].hidden = false;

    var fila = event.target.parentNode; 
    var nombre = fila.childNodes[0].innerHTML;
    var apellido = fila.childNodes[1].innerHTML;
    var localidad = fila.childNodes[2].innerHTML;
    var sexo = fila.childNodes[3].innerHTML;
    
    for (let i = 0; i < listaPersonas.length; i++) {
        if(listaPersonas[i].nombre == nombre && listaPersonas[i].apellido == apellido){
            idPersona = listaPersonas[i].id;
            id = listaPersonas[i].localidad.id;
            break;
        }
    }
    
    $("nombre").value = nombre;
    $("apellido").value = apellido;
    $("localidad").value = localidad;
    if(sexo == "Female"){
        $("femenino").checked = true;
    }else if (sexo == "Male"){
        $("masculino").checked = true;
    }

    addOptions("localidad", localidad);
}

window.addEventListener("load", () => {
    cargarUsuarios();
});

function modificarBoton()
{
    let flagNombre = true;
    let flagApellido = true;
    let flagSexo = true;
    let flagLocalidad = true;
    
    if($("nombre").value.length < 1)
    {
        
        $("nombre").style.borderColor="red";          
        flagNombre = false;

    }

    if($("apellido").value.length < 1)
    {
        
        $("apellido").style.borderColor="red";          
        flagApellido = false;

    }

    if(!($("masculino").checked || $("femenino").checked))
    {
        flagSexo = false;
    }

    if(document.getElementsByClassName("opcionn")[0].innerText != 'Barracas'){
        flagLocalidad = false;
    }


    if(flagNombre && flagApellido && flagSexo && flagLocalidad)
    {
        var nombreInput= $("nombre").value;
        var apellidoInput = $("apellido").value;
        var sexoInput;
        var nombre = document.getElementsByClassName("opcionn")[0].innerText;

        if($("masculino").checked)
        {
            sexoInput = "Male";
            $("femenino").checked = false;
        }else{
            sexoInput = "Female";
            $("masculino").checked = false;
        }

        var jsonPersona={"id":idPersona, "nombre":nombreInput,"apellido":apellidoInput,"localidad":{id,nombre},"sexo":sexoInput}

        var peticion = new XMLHttpRequest();
        peticion.onreadystatechange = function() 
        {
            
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                $("spinner").hidden = true;
                
                fila.childNodes[0].innerHTML = nombreInput;
                fila.childNodes[1].innerHTML = apellidoInput;           
            }
        }

        peticion.open("POST","http://localhost:3000/editar");
        peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        peticion.send(JSON.stringify(jsonPersona));
        
        $("spinner").hidden = false;      
        cargarUsuarios();
    }
}

function addOptions(domElement,localidad){
    var select = document.getElementsByName(domElement)[0];
    var option = document.createElement("option");
    option.className = "opcionn";
    option.text = localidad;
    select.add(option);
}
