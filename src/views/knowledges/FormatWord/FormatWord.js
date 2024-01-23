import React, { useEffect, useState } from "react"
import { Row, Col, Button } from 'reactstrap'
// import FileUploaderSingle from "../../forms/form-elements/file-uploader/FileUploaderSingle"
import { saveAs } from "file-saver";
import { TemplateHandler } from 'easy-template-x';

const FormatWord = () => {
    const generateDocument = async() => {
        const response = await fetch('/../../template/NguyenVietDuc/NguyenVietDuc.docx');
        const templateFile = await response.blob();
        const data = {
            info: [
                {
                    "index": "1",
                    "name": "Việt Đức",
                    "birthday": "24/12/2001"
                }
            ]
        }
        const handler = new TemplateHandler();
        const doc = await handler.process(templateFile, data);
        saveAs(doc, 'word.docx')
    }
    return (
        <React.Fragment>
            <Row>
                <Col sm='12'>
                    {/* <FileUploaderSingle files={files} setFiles={setFiles} /> */}
                </Col>
                <Col sm='12' className="d-flex justify-content-center">
                    <Button onClick={generateDocument} className="btn btn-success">Generate File</Button>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default FormatWord