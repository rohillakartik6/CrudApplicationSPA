/* eslint-disable eqeqeq */
import React, { useEffect, useRef } from "react";
import "./FileUpload.css";
import "dropify/dist/css/dropify.min.css";
import $ from "jquery";
import "dropify";

function DragAndDropFileUpload(props) {
    const fileInputRef = useRef(null);

    useEffect(() => {
        const dropzone = $(fileInputRef.current).dropify().data("dropify");
        dropzone.settings["imgFileExtensions"] = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];
    }, []);

    useEffect(() => {
        // if (props.flag != undefined) {
        if (typeof props.url == "string") {
            $(fileInputRef.current).dropify();

            const dropzone = $(fileInputRef.current).dropify().data("dropify");
            dropzone.element.addEventListener("dragover", handleDragOver, false);
            dropzone.element.addEventListener("dragleave", handleDragLeave, false);
            dropzone.element.addEventListener("drop", handleDrop, false);
            dropzone.resetPreview();
            dropzone.clearElement();
            dropzone.settings["defaultFile"] = props.url;
            dropzone.destroy();
            dropzone.init();

            return () => {
                dropzone.element.removeEventListener("dragover", handleDragOver);
                dropzone.element.removeEventListener("dragleave", handleDragLeave);
                dropzone.element.removeEventListener("drop", handleDrop);
            };
        } else if (typeof props.url == "object") {
            $(fileInputRef.current).dropify();

            const dropzone = $(fileInputRef.current).dropify().data("dropify");
            dropzone.element.addEventListener("dragover", handleDragOver, false);
            dropzone.element.addEventListener("dragleave", handleDragLeave, false);

            return () => {
                dropzone.element.removeEventListener("dragover", handleDragOver);
                dropzone.element.removeEventListener("dragleave", handleDragLeave);
                dropzone.element.removeEventListener("drop", handleDrop);
            };
        }
    }, [props]);

    const handleDragOver = (e) => {
        e.preventDefault();
        $(fileInputRef.current).addClass("drag-over");
    };

    const handleDragLeave = () => {
        $(fileInputRef.current).removeClass("drag-over");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        $(fileInputRef.current).removeClass("drag-over");
        const { files } = e.dataTransfer;
        $(fileInputRef.current).dropify().data("dropify").resetPreview();
        $(fileInputRef.current).dropify().data("dropify").settings.defaultFile = URL.createObjectURL(files[0]);
        $(fileInputRef.current).dropify().data("dropify").settings.error.default = "";
        $(fileInputRef.current).dropify().data("dropify").setFile(files[0]);
    };

    return (
        <>
            <div
                className="img-container"
                style={{}}>
                <input
                    className="img-preview"
                    id={props?.id}
                    onChange={props.onChange}
                    accept="image/*"
                    type="file"
                    ref={fileInputRef}
                    data-show-remove="false"
                />
                {/* {props.url != "" && props.url != null && (
                    <button
                        name={props.name}
                        type="button"
                        className="img-button"
                        onClick={props.handleDelete}>
                        REMOVE
                    </button>
                )} */}
            </div>
        </>
    );
}

export default DragAndDropFileUpload;
