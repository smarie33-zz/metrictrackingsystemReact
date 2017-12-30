@extends('wrapperLayout')

@section('content')

<div class="container">
    <div class="row">
        <div class="col">
            <h1 class="text-center mt-5 mb-5">Shannon's Pilot Engineering Test :-)</h1>
        </div>
    </div>

    <div id="root"></div>
    
    <script src="{{mix('js/app.js')}}"></script>
</div>

@endsection