/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Button, Modal } from 'solid-bootstrap';
import { Component, createSignal, For, Show } from 'solid-js';
import { render } from 'solid-js/web';
import { AppContextState, DialogViewComponent } from '../../utils/types';

export default class DialogController {
    private region = document.getElementsByClassName('dialog-container')[0] as HTMLElement;
    private title: string;
    private body: string | undefined;
    private t: Function;
    private state?: AppContextState;
    private values?: any;
    private component?: Component<DialogViewComponent> | undefined;
    private buttons: { text: string; variant: string; submit?: boolean }[];
    private dispose!: () => void;
    private done: (ok: boolean | undefined, changes: any) => Promise<any>;
    private centered: boolean | undefined;
    private size: string | undefined;
    private options?: any;

    constructor(options: {
        title: string;
        body?: string;
        values?: any;
        t: Function;
        state?: any;
        component?: Component<DialogViewComponent>;
        buttons: { text: string; variant: string; submit?: boolean }[];
        done: (ok: boolean | undefined, changes: any) => Promise<any>;
        centered?: boolean | undefined;
        size?: string | undefined;
        options?: any;
    }) {
        this.title = options.title;
        this.state = options.state;
        this.body = options.body;
        this.values = options.values;
        this.component = options.component;
        this.buttons = options.buttons;
        this.done = options.done;
        this.t = options.t;
        this.centered = options.centered;
        this.size = options.size;
        this.options = options.options;
    }

    show() {
        const locale = localStorage.getItem('locale');
        const ContentViewComponent: any = this.component;
        const [changes, setChanges] = createSignal<any>();
        const [validate, setValidate] = createSignal<boolean>(false);

        this.dispose = render(() => (
            <Modal
                show={true}
                onHide={() => this.destroy()}
                size={this.size as 'sm' | 'lg' | 'xl' | undefined}
                aria-labelledby='contained-modal-title-vcenter'
                contentClass={locale === 'ar' ? 'rtl' : ''}
                // centered={this.centered}
            >
                <Modal.Header closeButton>
                    <Modal.Title id='contained-modal-title-vcenter'>
                        {this.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Show when={this.body}>
                        {/* eslint-disable-next-line solid/no-innerhtml */}
                        <h4 innerHTML={this.body?.replace(/\n/g, '<br>')} />
                    </Show>
                    <Show when={ContentViewComponent}>
                        <ContentViewComponent
                            changes={changes}
                            setChanges={setChanges}
                            validate={validate}
                            setValidate={setValidate}
                            values={this.values}
                            t={this.t}
                            state={this.state}
                            options={this.options}
                        />
                    </Show>
                </Modal.Body>
                <Modal.Footer>
                    <For each={this.buttons}>
                        {(button) => (
                            <Button
                                variant={button.variant}
                                class='dialog-button'
                                onClick={() => {
                                    if (!button.submit) {
                                        this.done(false, {});
                                        this.destroy();
                                        return;
                                    }
                                    setValidate(true);
                                    if (validate()) {
                                        this.done(button.submit, changes());
                                        this.destroy();
                                    }
                                }}
                            >
                                {button.text}
                            </Button>
                        )}
                    </For>
                </Modal.Footer>
            </Modal>
        ), this.region);
    }

    destroy(): void {
        this.dispose();
    }
}
