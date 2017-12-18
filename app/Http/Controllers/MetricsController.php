<?php

namespace App\Http\Controllers;

use App\Metric;
use App\MetricData;
use App\Dates;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class MetricsController extends Controller
{
    public function index(){

		$filedMetrics = [];
		$metrics = Metric::getMetrics();
		foreach ($metrics as $metric) {
			$filedMetrics[]['name'] = $metric->name;
			$filedMetrics[]['metrics'] = MetricData::getMetricsData($metric->id)->orderBy('date', 'ASC')->get(['id','metric_id','i_number','d_number','date']);
		}

		$dates = Dates::getTheseDates();

		$types['i'] = DB::connection()->getDoctrineColumn('metrics_data', 'i_number')->getType()->getName();
		$types['d'] = DB::connection()->getDoctrineColumn('metrics_data', 'd_number')->getType()->getName();

		//$tableAssets = [];
		//array_push($tableAssets, $filedMetrics, $dates, $types);
		
		//return $tableAssets;
	    return view('welcome.index', compact('filedMetrics','dates','types'));
    }

    public function buildTable(){

		$filedMetrics = [];
		$metrics = Metric::getMetrics();
		foreach ($metrics as $metric) {
			$fullMetrics = [];
			$fullMetrics['id'] = $metric->id;
			$fullMetrics['name'] = $metric->name;
			$fullMetrics['type'] = $metric->type;
			$fullMetrics['metrics'] = MetricData::getMetricsData($metric->id)->orderBy('date', 'ASC')->get(['id','metric_id','i_number','d_number','date']);
			$filedMetrics[] = $fullMetrics;
		}

		$dates = Dates::getTheseDates();

		$types['i'] = DB::connection()->getDoctrineColumn('metrics_data', 'i_number')->getType()->getName();
		$types['d'] = DB::connection()->getDoctrineColumn('metrics_data', 'd_number')->getType()->getName();

		$tableAssets = [];
		$tableAssets['filedMetrics'] = $filedMetrics;
		$tableAssets['dates'] = $dates;
		$tableAssets['types'] = $types;
		
		return $tableAssets;
	    //return view('welcome.index', compact('filedMetrics','dates','types'));
    }

    public function store(Request $request){
    	 if(request()->ajax()) {
	         $data = Input::all();
	     }

	     $metric = new Metric;
	     $metric->name = $data['metricName'];
	     $metric->save();
	     $lastMetric = $metric->id;

	     $metricData = new MetricData;
	     foreach($data['metrics'] as $metricJson){
	     	$metricData->metric_id = $lastMetric;
	     	$metricData->date = $metricJson['date'];
	     	if($data->type == 'Integer'){
	     		$metricData->i_number = $metricJson['num'];
	     	}else{
	     		$metricData->d_number = $metricJson['num'];
	     	}
	     	$metricData->save();
	     }

	     $dates = Dates::getOnlyDates();
		 $newDates = array_diff($addedDates, $data['addDates']);
		 if(!empty($newDates)){
		 	foreach($newDates as $newDate)
		 	$ddate = new Dates;
		 	$ddate->date = $newDate;
		 	$ddate->save();
		 }

	     return response()->json(array('success' => true, 'data' => $newDates));
    }

    public function destroy(){
    	// if(Request::ajax()) {

    	// }
    }
}
