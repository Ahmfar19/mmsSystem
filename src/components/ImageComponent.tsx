import { useI18n } from '@solid-primitives/i18n';
import { Accessor, Component, createEffect, createSignal, For, Setter } from 'solid-js';

const ImageComponent: Component<{
    handleChange(event: Event): any;
    shouldClear: Accessor<boolean>;
    setShouldClear: Setter<boolean>;
}> = (props) => {
    const [selectedFiles, setSelectedFiles] = createSignal<Array<File | null>>([]);
    const [t] = useI18n();

    const handleFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            setSelectedFiles(Array.from(input.files));
            props.handleChange(event);
        }
    };

    const handleDelete = (index: number) => {
        const updatedFiles = [...selectedFiles()];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    createEffect(() => {
        if (props.shouldClear()) {
            setSelectedFiles([]);
            props.setShouldClear(false);
        }
    });

    return (
        <>
            {/* <Container class="mt-5"> */}
            <h2 class='mb-4'>{t('ipaz_mark_photosUpload')}</h2>
            <div class='mb-3'>
                <label for='fileInput' class='btn btn-primary'>{t('ipaz_mark_photosChose')}</label>
                <input
                    type='file'
                    id='fileInput'
                    accept='image/*'
                    name='logo'
                    multiple
                    class='d-none'
                    onChange={handleFileChange}
                />
            </div>
            <div class='row row-cols-1 row-cols-md-3'>
                <For each={selectedFiles()}>
                    {(file, i) => (
                        <div class='col mb-4'>
                            <div class='card'>
                                {file && (
                                    <>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt='Uploaded Photo'
                                            class='card-img-top'
                                        />
                                        <div class='card-body bg-light'>
                                            <button
                                                class='btn btn-danger btn-block'
                                                onClick={() => handleDelete(i())}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </For>
            </div>
            {/* </Container> */}
        </>
    );
};

export default ImageComponent;
