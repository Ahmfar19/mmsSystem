import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

type ToastType = 'success' | 'error' | 'warning' | 'default';

interface ToastOptions {
    message: string;
    type?: ToastType;
    duration?: number;
    ripple?: boolean;
    dismissible?: boolean;
    position?: {
        x: 'left' | 'center' | 'right';
        y: 'top' | 'center' | 'bottom';
    };
}

const notyf = new Notyf({
    types: [
        {
            type: 'default',
            background: 'rgb(59, 125, 221)',
            icon: {
                className: 'notyf__icon--success',
                tagName: 'i',
            },
        },
    ],
});

export default function showToast(options: ToastOptions): void {
    const {
        message,
        type = 'default',
        duration = 5000,
        ripple = true,
        dismissible = true,
        position = { x: 'right', y: 'top' },
    } = options;

    notyf.open({
        type,
        message,
        duration,
        ripple,
        dismissible,
        position,
    });
}
