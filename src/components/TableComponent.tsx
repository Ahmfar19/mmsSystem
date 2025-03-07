import { useI18n } from '@solid-primitives/i18n';
import DataTable from 'datatables.net-bs5';
import feather from 'feather-icons';
import { Component, createEffect, For, onCleanup, onMount } from 'solid-js';
import { useAppContext } from '../AppContext';
// import pdfMake from 'pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';

const TableComponent: Component<{
    id: string;
    data: any;
    columnsHeader: string[];
    keys: string[];
    handleDelete?: (id: number) => Promise<boolean>;
    handleUpdate?: (id: number) => void;
    options: { edit: boolean; delete: boolean; id: string };
}> = (props) => {
    const [t, { locale }] = useI18n();
    const { store } = useAppContext();

    let myTable: any;
    let handleClicking = false;

    createEffect(() => {
        if (props.data() && !handleClicking) {
            if (myTable) {
                // await myTable.rows().remove().draw();
                myTable.clear().draw();
                myTable.destroy();
            }

            onMount(() => {
                initTable();
                if (props.options.edit || props.options.delete) {
                    listeanToSearchInput();
                    listeanToSortingElement();
                    listeanToPaginate();
                }
            });
        }
        handleClicking = false;
    });

    // Add event listeners to the results buttons after searching is done
    function listeanToSearchInput() {
        const filterDiv = document.getElementById(`${props.id}_filter`);
        const inputElement = filterDiv?.querySelector('input[type="search"]');
        inputElement?.addEventListener('input', () => {
            addEventListener();
        });
    }

    function listeanToPaginate() {
        const paginateDiv = document.getElementsByClassName('pagination');

        if (paginateDiv) {
            Array.from(paginateDiv).forEach((element) => {
                element?.addEventListener('click', () => {
                    addEventListener();
                });
            });
        }
    }

    function listeanToSortingElement() {
        const tableDiv = document.getElementById(`${props.id}_wrapper`);
        const inputElement = tableDiv?.getElementsByClassName('sorting');
        if (inputElement) {
            Array.from(inputElement).forEach((element) => {
                element?.addEventListener('click', () => {
                    addEventListener();
                });
            });
        }
        const showElement = document.querySelector(`select[name="${props.id}_length"]`);
        showElement?.addEventListener('change', () => {
            addEventListener();
        });
    }

    function addEventListener() {
        const elements = document.querySelectorAll('.option');
        elements.forEach((element) => {
            element.addEventListener('click', (e) => handleClick(e));
            const td = (element.parentNode?.parentNode) as HTMLTableElement;
            td.classList.add(element.id);
        });
    }

    function initTable() {
        // @ts-ignore
        // pdfMake.vfs = pdfFonts.pdfMake.vfs;
        myTable = new DataTable(`#${props.id}`, {
            dom: 'Bfrltip',
            responsive: true,
            // orderClasses: false,
            // ordering: true,
            order: [[0, 'desc']],
            buttons: ['copy', 'csv', 'print'],

            ajax(data, callback) {
                const out: any = [];

                props.data().forEach((item: any) => {
                    const rowData = props.keys.map(attribute => item[attribute] ?? '');
                    let htmlContent = '';
                    if (props.options.delete && store.isAdmin) {
                        htmlContent = `
                        <button 
                            class="btn btn-danger mx-1 my-1 option" id=${
                            item[props.options.id]
                        } data-bs-toggle="tooltip" data-bs-placement="left"
                            title=${t('ipaz_buttonTooltip_delete')}
                        >
                            ${feather.icons['trash-2'].toSvg()}
                        </button>`;
                    }
                    if (props.options.edit) {
                        htmlContent += `
                        <button 
                            class="btn btn-primary mx-1 my-1 option" id=${
                            item[props.options.id]
                        } data-bs-toggle="tooltip" data-bs-placement="left"
                            title=${t('ipaz_buttonTooltip_edit')}
                        >
                            ${feather.icons.edit.toSvg()}
                        </button>`;
                    }
                    if (htmlContent.length > 0) {
                        rowData.push(htmlContent);
                    }
                    out.push(rowData);
                });

                setTimeout(() => {
                    callback({
                        data: out,
                    });
                    addEventListener();
                }, 50);
            },
        });
    }

    onCleanup(() => {
        if (myTable) {
            myTable.destroy();
        }
    });

    async function handleClick(e: any) {
        const target = e.currentTarget;
        const id = target.id;

        const isDeleteClick = target.classList.contains('btn-danger');

        if (isDeleteClick) {
            if (!props.handleDelete) return;
            handleClicking = true;
            const result: boolean = await props.handleDelete(id);
            if (result) {
                myTable.rows(`.${id}`).remove().draw();
            }
        } else {
            if (!props.handleUpdate) return;
            props.handleUpdate(+id);
        }
    }

    return (
        <>
            <table
                id={props.id}
                class='table table-striped table-bordered'
                style={{ 'width': '100%' }}
                dir={locale() === 'ar' ? 'rtl' : 'ltr'}
            >
                <thead>
                    <tr>
                        <For each={props.columnsHeader}>
                            {(row) => <td>{t(row)}</td>}
                        </For>
                    </tr>
                </thead>
            </table>
        </>
    );
};

export default TableComponent;

// Extra import
// import jszip from 'jszip';
// import 'datatables.net-scroller-bs5';
// import 'datatables.net-searchbuilder-bs5';

// Whith Jquery
// onMount(() => {
//   // @ts-ignore
//   pdfMake.vfs = pdfFonts.pdfMake.vfs;

//   datatablesButtons = $("#example").DataTable({
//     dom: 'Bfrltip', // Show buttons (B), filtering (f), processing display element (r), information (i), and table (t)
//     responsive: true,
//     buttons: ['copy', 'csv', 'pdf', 'print']
//   });

// })

// Append the buttons
// console.log('datatablesButtons.buttons()', datatablesButtons.buttons());
// datatablesButtons.buttons().container().appendTo("#example_wrapper .col-md-6:eq(0)");

// Manage the buttons
//   buttons: [
//     {
//       extend: 'copy',
//       exportOptions: {
//         columns: [0, 1, 2, 3], // Specify the columns to copy
//       },
//     },
//     {
//       extend: 'pdf',
//       customize: (doc) => {
//         // Set font family for the PDF
//         doc.defaultStyle.font = 'Roboto'; // Change 'Roboto' to the desired font family
//       },
//     },
//     'print',
//     'excel',
//   ],

// Cutsom button
// buttons: [
//   {
//     text: 'My button',
//     action (e, dt, node, config) {
//       alert('Button activated');
//     }
//   }
// ]
