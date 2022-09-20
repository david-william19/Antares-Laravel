<?php

namespace App\Http\Controllers;

use App\Events\TemperatureEvent;
use Salman\Mqtt\MqttClass\Mqtt;
use App\Models\Sensor;
use Illuminate\Http\Client\Request;

class AntaresController extends Controller
{

    public function display()
    {
        $sensor = Sensor::get();
        return view('home');
    }
}
