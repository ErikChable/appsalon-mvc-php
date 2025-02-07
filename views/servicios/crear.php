<h1 class="nombre-pagina">Nuevo Servicio</h1>
<p class="descripcion-pagina">Administración de Servicios</p>

<?php
// include_once __DIR__ . '/../templates/barra.php'; 
include_once __DIR__ . '/../templates/alertas.php';
?>

<form action="/servicios/crear" method="POST" class="formulario">
    <?php include_once __DIR__ . '/formulario.php'; ?>

    <div class="btn-acciones">
        <a href="/admin" class="boton">Volver</a>
        <input type="submit" class="boton" value="Guardar Servicio">
    </div>

</form>