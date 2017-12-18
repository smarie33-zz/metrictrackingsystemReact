<div class="row">
    <div class="col-xs-12">
        <table class="table table-striped">
            <tr>
                <th>Metric Name</th>
                <th>Data type</th>
                @foreach ($dates as $date)
                    <th class="sm-dates-table">{{Carbon\Carbon::parse($date->date)->format('M-Y')}}</th>
                @endforeach
            </tr>
           
        </table>
    </div>
</div>