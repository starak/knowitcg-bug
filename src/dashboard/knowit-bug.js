import { observable, observableArray, applyBindings } from 'knockout';
import debounce from 'debounce';
import './knowit-bug.scss';

( function() {

    let init = false;
    const bundle = nodecg.Replicant( 'knowit-bug' );
    bundle.on( 'change', newData => {
        if ( newData && !init ) {
            init = true;
            viewModel.selectedSize( [viewModel.sizes()[newData.size]] );
            viewModel.selectedColor( [viewModel.colors()[newData.type]] );
            viewModel.opacity( newData.opacity );
            viewModel.visible( newData.visible );
            viewModel.subscribe();
        }
    } );

    class ViewModel {
        constructor() {
            this.sizes = observableArray( ['Large', 'Medium', 'Small'] );
            this.selectedSize = observableArray( ['White'] );
            this.colors = observableArray( ['White', 'Green', 'Black'] );
            this.selectedColor = observableArray( ['White'] );
            this.opacity = observable( 50 );
            this.visible = observable(false);
        }

        subscribe(){
            this.selectedSize.subscribe( ( newValue ) => {
                bundle.value.size = this.sizes().indexOf( newValue[0] );
            } );
            this.selectedColor.subscribe( newValue => {
                bundle.value.type = this.colors().indexOf( newValue[0] );
            } );
            this.opacity.subscribe( debounce( newValue => {
                bundle.value.opacity = newValue;
            } ), 200 );
            this.visible.subscribe( newValue => {
                bundle.value.visible = newValue;
            } );
        }

        toggleVisible() {
            this.visible( !this.visible() );
        }

        bindings() {
            this.toggleVisible = this.toggleVisible.bind( this );
        }
    }

    const viewModel = new ViewModel();

    applyBindings( viewModel )
} )();