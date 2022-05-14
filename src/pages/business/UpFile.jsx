import { UploadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../common/styles/upfile.css";
import { insertBusiness } from "../../features/businessSlice.js/businessSlice";
const UpFile = ({ smester_id, name }) => {
  const [data, setData] = useState();
  const [dataNew, setDataNew] = useState([]);
  const [nameFile, setNameFile] = useState("");
  const dispatch = useDispatch();
  const {
    infoUser: { manager },
  } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.students);
  const navigate = useNavigate();
  const importData = (e) => {
    const file = e.target.files[0];
    setNameFile(file.name);
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const fileData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let headers = fileData[0];
      fileData.splice(0, 1);
      if (headers.length === 0) {
        headers = fileData[0];
      }
      const rows = [];
      fileData.forEach((item) => {
        let rowData = {};
        item.forEach((element, index) => {
          rowData[headers[index]] = element;
        });
        rows.push(rowData);
      });
      let datas = [];
      console.log(rows);
      rows
        .filter((item, index) => index !== 0)
        // eslint-disable-next-line array-callback-return
        .map((item) => {
          const newObject = {};
          if (manager) {
            if (item["Tên doanh nghiệp"] !== undefined) {
              newObject["name"] = item["Tên doanh nghiệp"];
              newObject["internshipPosition"] = item["Vị trí thực tập"];
              newObject["amount"] = item["Số lượng"];
              newObject["address"] = item["Địa chỉ doanh nghiệp"];
            }
            Object.keys(newObject).length > 0 && datas.push(newObject);
          }
        });
      setDataNew(datas);
      setData(fileData);
      refInput.current.value = ''
    };
    reader.readAsBinaryString(file);
  };

  const submitSave = () => {
    const dataUpload = { data: dataNew, smester_id };
    dispatch(insertBusiness(dataUpload)).then((res) => {
      notifications(res.payload);
      setDataNew([]);
      setNameFile();
    });
  };
  const notifications = (payload) => {
    if (loading === false && payload !== undefined) {
      message.success("Thành công");
      navigate("/status");
    }
  };
  const submitCole = () => {
    setDataNew([]);
    setNameFile();
    refInput.current.value = ''
  };

  const refInput = useRef();
  console.log("data: ", data);
  console.log("dataNew: ", dataNew);
  return (
    <div className="header">
      <label htmlFor="up-file">
        <div className="button-upfile">
          {" "}
          <UploadOutlined className="icon" /> Tải file excel
        </div>{" "}
        {nameFile && dataNew.length > 0 && (
          <span className="span-upload-name">{nameFile}</span>
        )}
      </label>
      <input
        type="file"
        ref={refInput}
        onChange={(e) => importData(e)}
        id="up-file"
      />
      {data && dataNew.length > 0 && (
        <div className="button">
          <Button
            style={{ marginRight: 10 }}
            onClick={() => submitSave()}
            type="primary"
          >
            Lưu
          </Button>
          <Button onClick={() => submitCole()} type="danger">
            Huỷ
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpFile;
