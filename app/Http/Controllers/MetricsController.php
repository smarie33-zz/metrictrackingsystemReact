<?php

namespace App\Http\Controllers;

use App\Metric;
use App\MetricData;
use App\Dates;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

class MetricsController extends Controller
{
    public function index(){

	    return view('welcome.index');
    }

    public function buildTable(){

    	$dates = Dates::getTheseDates();

		$filedMetrics = [];
		$dbMetrics = [];
		$metrics = Metric::getMetrics();
		foreach ($metrics as $metric):
			$fullMetrics = [];
			$fullMetrics['id'] = $metric->id;
			$fullMetrics['name'] = $metric->name;
			$fullMetrics['type'] = $metric->type;
			$fullMetrics['metrics'] = [];

			$getMetrics = MetricData::getMetricsData($metric->id)->orderBy('date', 'ASC')->get(['id','metric_id','i_number','d_number','date']);
			
			$orgCount = count($getMetrics);
	        foreach ($dates as $dindex=>$date):
	        	$dates[$dindex]['formatted'] = Carbon::parse($date->date)->format('M-Y');
	            foreach ($getMetrics as $index=>$data):
	            	$leDatas = [];
	            	if ($index != count($getMetrics) -1 || $index == count($getMetrics) -1):
		                if ($date->formatted == Carbon::parse($data->date)->format('M-Y')):
		                	$leDatas['id'] = $data->id;
		                	$leDatas['date'] = $data->date;
		                    if ($data->i_number != null):
		                        $leDatas['point'] = $data->i_number;
		                    elseif ($data->d_number != null):
		                        $leDatas['point'] = $data->d_number;
		                    endif;
		                    //unset($getMetrics[$index]);
		                    break;
		                else:
		                    $leDatas['id'] = "";
		                	$leDatas['point'] = "";
		                	//unset($getMetrics[$index]);
		                endif;
	                endif;
	            endforeach;
	            // if ($dindex > $orgCount):
	            //     $leDatas['id'] = "";
	            //     $leDatas['point'] = "";
	            // endif;
	            $fullMetrics['metrics'][] = $leDatas;
	        endforeach;

			$filedMetrics[] = $fullMetrics;
		endforeach;

		$tableAssets = [];
		$tableAssets['filedMetrics'] = $filedMetrics;
		$tableAssets['dates'] = $dates;
		
		return $tableAssets;
    }

    public function store(Request $request){
 
 	    $data = Input::all();

	    $metric = new Metric;
	    $metric->name = $data['metricName'];
	    $metric->type = $data['type'];
	    $metric->save();
	    $lastMetric = $metric->id;

	    $addedDates = [];
	    
	    foreach($data['metrics'] as $metricJson):
	    	$metricData = new MetricData;
	      	$metricData->metric_id = $lastMetric;
	        $formattedDate = Carbon::parse($metricJson['date'])->format('Y-m-d');
	        $addedDates[] = Carbon::parse($metricJson['date'])->format('Y-m-01');
	      	$metricData->date = $formattedDate;
	      	if($data['type'] == 'Integer'):
	      		$metricData->i_number = $metricJson['point'];
	      	else:
	      		$metricData->d_number = $metricJson['point'];
	      	endif;
	      	$metricData->save();
	    endforeach;

	    $dates = Dates::getOnlyDates();
	   	$newDates = array_diff($addedDates, $dates);
		if(!empty($newDates)):
		 	foreach($newDates as $newDate):
			 	$ddate = new Dates;
			 	$ddate->date = $newDate;
			 	$ddate->save();
		 	endforeach;
		endif;

	    return response()->json(array('success' => true, 'data' => $newDates));
    }

    public function update(Request $request){
    	$data = Input::all();
    	
    	if(isset($data['metricName'])):
    		$metric = new Metric;
    		$metric->where('id', $data['metridID'])->update(['name' => $data['metricName']]);
    		$updated = 'The selected metric has been updated';
    	endif;

    	if(isset($data['metricPoints'])):
    		$pointAmount = count($data['metricPoints']) / 3;
    		if($data['metricType'] == 'Integer'):
    			$dType = 'i_number';
    		else:
    			$dType = 'd_number';
    		endif;
    		for ($x = 0; $x < $pointAmount; $x++):    			
    			if(empty($data['metricPoints']['id'.$x])){
    				$metricData = new MetricData;
    				$metricData->metric_id = $data['metricId'];
					$metricData->$dType = $data['metricPoints']['point'.$x];
					$metricData->date = $data['metricPoints']['pointDate'.$x];
			 		$metricData->save();
			 		$this->addDateIfNotThere(Carbon::parse($data['metricPoints']['pointDate'.$x])->format('Y-m-01'));
    			}else{
    				//using save because it will check if dirty
	    			$metricData = MetricData::find($data['metricPoints']['id'.$x]);
				 	$metricData->date = $data['metricPoints']['pointDate'.$x];
				 	$metricData->$dType = $data['metricPoints']['point'.$x];
				 	$metricData->save();
    			}
    		endfor;
    		$updated = 'All points under the selected metric have been updated';
    	endif;

    	return response()->json(array('success' => $updated));
    }

    public function destroy(Request $request){
    	$data = Input::all();

    	if(isset($data['metricPoint'])):
			$metricData = new MetricData;
			$metricData->destroy($data['metricPoint']);
			$removed = 'The selected data points have been removed';
    	endif;

    	if(isset($data['fullmetric'])):
    		$metric = new Metric;
    		$metric->destroy($data['fullmetric']);

    		$asscoData = MetricData::getMetricsData($data['fullmetric'])->get(['id']);
    		$pointsToDelete = [];
    		foreach($asscoData as $points):
    			$pointsToDelete[] = $points->id;
    		endforeach;
    		$metricData = new MetricData;
			$metricData->destroy($pointsToDelete);

    		$removed = 'The selected metric has been removed';
    	endif;

    	$cheked = $this->checkIfDateExists();

    	return response()->json(array('success' => $cheked));
    }

    private function checkIfDateExists(){
    	$dbDates = Dates::getOnlyDates();
    	$mDates = MetricData::getOnlyMetricDates();
    	$convert = [];
    	foreach($mDates as $d):
    		$convert[] = Carbon::parse($d)->format('Y-m-01');
    	endforeach;
    	$noLongerInPoints = array_diff($dbDates, $convert);
    	if(!empty($noLongerInPoints)):
    		$deleteTheseDates = [];
	    	foreach($noLongerInPoints as $toRemove):
	    		$dbDates = Dates::where('date', $toRemove)->delete();
			endforeach;
	    	//$deleteDates = new Dates;
	    	//$deleteDates->destroy($deleteTheseDates);
	    endif;
	    $returnArray = $noLongerInPoints;
	    return $returnArray;
    }

    private function addDateIfNotThere($metricDate){
    	$dbDates = Dates::getOnlyDates();
    	if(!in_array($metricDate, $dbDates)):
    		$date = new Dates;
    		$date->date = $metricDate;
    		$date->save();
	    endif;
    }
}
