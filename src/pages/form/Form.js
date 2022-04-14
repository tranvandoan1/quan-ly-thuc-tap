import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Spin,
  Space,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportFormAPI from "../../API/ReportFormAPI";
import CountDownCustorm from "../../components/CountDownCustorm";
import { getTimeForm } from "../../features/timeDateSlice/timeDateSlice";

import styles from "./Form.module.css";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Formrp = () => {
  const { time } = useSelector((state) => state.time.formTime);
  const [spin, setSpin] = useState(false);
  const [startDate, setStartDate] = useState();
  const [file, setFile] = useState();
  const [form] = Form.useForm();
  const { infoUser } = useSelector((state) => state.auth);
  const mssv = infoUser.student.mssv;
  const email = infoUser?.student?.email;
  const dispatch = useDispatch()
  const datePicker = (date, dateString) => {
    setStartDate(new Date(date._d).getTime());
    
  };

  useEffect(() => {
    dispatch(getTimeForm(3));
  }, []);

  function guardarArchivo(files, data) {
    const file = files; //the file
    const urlGGDriveCV = `https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec
     `;

    var reader = new FileReader(); //this for convert to Base64
    reader.readAsDataURL(file); //start conversion...
    reader.onload = function (e) {
      //.. once finished..
      var rawLog = reader.result.split(",")[1]; //extract only thee file data part
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      }; //preapre info to send to API
      fetch(
        urlGGDriveCV, //your AppsScript URL
        { method: "POST", body: JSON.stringify(dataSend) }
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          const newData = { ...data, form: a.url };
          ReportFormAPI.uploadForm(newData)
            .then((res) => {
              message.success(res.data.message);
              form.resetFields();
            })
            .catch(async (err) => {
              const dataErr = await err.response.data;
              if (!dataErr.status) {
                message.error(`${dataErr.message}`);
                form.resetFields();
              } else {
                message.error(`${dataErr.message}`);
              }
            });
          setSpin(false);
        })
        .catch((e) => {
          message.success("Có lỗi xảy ra! Vui lòng đăng ký lại");
          form.resetFields();
          setSpin(false);
        }); // Or Error in console
    };
  }

  const normFile = (e) => {
    const valueFile = e.file.originFileObj.type;
    const isFile = valueFile;

    if (
      isFile === "image/jpeg" ||
      isFile === "image/jpg" ||
      isFile === "image/png"
    ) {
      setFile(e.file.originFileObj);
    } else {
      form.resetFields();
      message.error("Vui lòng nhập file đúng định dạng PNG-JPEG-JPG");
    }
  };

  const onFinish = async (values) => {
    setSpin(true);
    try {
      const newData = {
        ...values,
        mssv: mssv,
        email: email,
        internShipTime: startDate,
      };
      await guardarArchivo(file, newData);
    } catch (error) {
      const dataErr = await error.response.data;
      message.error(dataErr.message);
    }
  };
  const check = time.endTime > new Date().getTime() && infoUser?.student?.CV;
  return (
    <>
      {spin ? <Spin /> : null}
      {check && <CountDownCustorm time={time} />}
      {check ? (
        <Form
          {...formItemLayout}
          form={form}
          className={styles.form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          scrollToFirstError
        >
          <Form.Item
            name="nameCompany"
            label="Tên doanh nghiệp"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên doanh nghiệp",
              },
            ]}
          >
            <Input placeholder="Tên doanh nghiệp" />
          </Form.Item>
          <Form.Item
            name="attitudePoint"
            label="Mã số thuế"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã số thuế của doanh nghiệp",
              },
            ]}
          >
            <Input placeholder="Nhập mã số thuế doanh nghiệp" />
          </Form.Item>

          <Form.Item
            name="internshipTime"
            label="Thời gian bắt đầu thực tập"
            // rules={[{}]}
          >
            <Space direction="vertical">
              <DatePicker
                onChange={datePicker}
                placeholder="Bắt đầu thực tập"
              />
            </Space>
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Bạn phải nộp cv rồi mới đến biểu mẫu</p>
      )}
    </>
  );
};

export default Formrp;