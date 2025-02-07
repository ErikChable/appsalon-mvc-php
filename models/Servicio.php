<?php

namespace Model;

class Servicio extends ActiveRecord
{
    // BD
    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id', 'nombre', 'precio'];

    // Atributos
    public $id;
    public $nombre;
    public $precio;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->precio = $args['precio'] ?? '';
    }

    public function validar()
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre del Servicio es Obligatorio';
        }

        if (strlen($this->nombre) > 60) {
            self::$alertas['error'][] = 'El Nombre del Servicio no puede tener más de 60 caracteres';
        }

        if (!$this->precio) {
            self::$alertas['error'][] = 'El Precio del Servicio es Obligatorio';
        } else if (!is_numeric($this->precio)) {
            self::$alertas['error'][] = 'El Precio no es válido';
        }

        return static::$alertas;
    }
}
