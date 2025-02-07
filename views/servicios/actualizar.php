<h1 class="nombre-pagina">Actualizar Servicio</h1>
<p class="descripcion-pagina">Llena todos los campos para añadir un nuevo servicio</p>

<?php
// include_once __DIR__ . '/../templates/barra.php'; 
include_once __DIR__ . '/../templates/alertas.php';
?>

<form method="POST" class="formulario">
    <?php include_once __DIR__ . '/formulario.php'; ?>

    <div class="btn-acciones">
        <a href="/servicios" class="boton">Volver</a>
        <input type="submit" class="boton" value="Actualizar Servicio">
    </div>

</form>

<?php
$script = "
        <script src='sweetalert2.all.min.js'></script>
        <script src='build/js/admin.js'></script>
    ";
?>