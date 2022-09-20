<?php

namespace App\Http\Controllers;

use App\Events\TemperatureEvent;
use App\Models\Sensor;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    //
    public function index(Request $request, Sensor $sensor)
    {
        $bodyContent = $request->getContent();
        $sensor->api($request, $sensor);
        broadcast(new TemperatureEvent($bodyContent));
        return gettype($bodyContent);
    }

}
