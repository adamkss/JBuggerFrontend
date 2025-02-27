import React, { PureComponent } from 'react';
import './GenericModal.css';

export default class GenericModal extends PureComponent {
    state = {
        animated: false
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                animated: true
            })
        }, 0);
    }

    onKeyDown = (event) => {
        if(event.keyCode == 27){
            this.props.onClose();
        }
    }

    render() {
        let modalContentClassnames = this.state.animated ? "generic-modal__content generic-modal-animated" : "generic-modal__content";
        return (

            <div className="generic-modal" tabIndex="-1" onKeyDown={this.onKeyDown}>
                <main className={modalContentClassnames}>
                    <header className="generic-modal__header">
                        <a aria-label="Close" href="#" role="button" onClick={this.props.onClose} className="header__close-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                                <path d="M9,7.5l5.83-5.91a.48.48,0,0,0,0-.69L14.11.15a.46.46,0,0,0-.68,0l-5.93,6L1.57.15a.46.46,0,0,0-.68,0L.15.9a.48.48,0,0,0,0,.69L6,7.5.15,13.41a.48.48,0,0,0,0,.69l.74.75a.46.46,0,0,0,.68,0l5.93-6,5.93,6a.46.46,0,0,0,.68,0l.74-.75a.48.48,0,0,0,0-.69Z">
                                </path>
                            </svg>
                        </a>
                    </header>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

