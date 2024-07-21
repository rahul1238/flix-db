import { useEffect } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { useController } from 'react-hook-form';
import { FormItem, FormLabel, FormMessage } from './ui/form';

export default function FileDrop() {
    const { field: { onChange, value } } = useController({
        name: 'images'
    });
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        }
    });

    useEffect(() => {
        if (acceptedFiles.length)
            onChange(acceptedFiles);
    }, [acceptedFiles])

    const files = value?.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size / 1000} kbs
        </li>
    ));

    return (
        <FormItem>
            <section className="space-y-4">
                <FormLabel>Images</FormLabel>
                <div
                    {...getRootProps({ className: 'dropzone' })}
                    className='h-32 cursor-pointer text-sm px-4 grid place-items-center max-w-md border-dotted border-2 rounded-lg focus:border-0 '
                >
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <ul>{files}</ul>
                <FormMessage />
            </section>
        </FormItem>
    );
}
