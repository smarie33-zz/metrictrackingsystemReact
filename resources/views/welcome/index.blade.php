@extends('wrapperLayout')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <h1 class="text-center">Shannon's Pilot Engineering Test :-)</h1>
        </div>
    </div>
    @include('partials.table')
    @include('partials.form')
    <div id="root"></div>
    <script src="{{mix('js/app.js')}}"></script>
</div>

@endsection