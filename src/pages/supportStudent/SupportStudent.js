import { Form, Input, Select, Button, message, Spin, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterInternAPI from "../../API/RegisterInternAPI";
import { getListSpecialization } from "../../features/specializationSlice/specializationSlice";
import { getTimeForm } from "../../features/timeDateSlice/timeDateSlice";
import Countdown from "react-countdown";
import styles from "./SupportStudent.module.css";
import CountDownCustorm from "../../components/CountDownCustorm";
import Proactive from "./Proactive";
import Support from "./Support";
import { getStudentId } from "../../features/cumpusSlice/cumpusSlice";
const { Option } = Select;
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
const SupportStudent = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [value, setValue] = useState(1);
  const [spin, setSpin] = useState(false);
  const { time } = useSelector((state) => state.time.formTime);
  const [form] = Form.useForm();
  const { listSpecialization } = useSelector((state) => state.specialization);
  const { student } = useSelector((state) => state.cumpus);
  const { infoUser } = useSelector((state) => state.auth);

  function guardarArchivo(files, data) {
    const file = files; //the file

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
        `https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec
    `, //your AppsScript URL
        { method: "POST", body: JSON.stringify(dataSend) }
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          const newData = { ...data, CV: a.url };
          RegisterInternAPI.upload(newData)
            .then((res) => {
              console.log(res);
              message.success(res.data.message);
              form.resetFields();
              setSpin(false);
            })
            .catch(async (err) => {
              const dataErr = await err.response.data;
              if (!dataErr.status) {
                message.error(`${dataErr.message}`);
                setSpin(false);
              } else {
                message.error(`${dataErr.message}`);
                setSpin(false);
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
    const valueFile = e.file.originFileObj;

    const isPDF = valueFile.type === "application/pdf";

    if (!isPDF) {
      message.error("Vui lòng nhập file đúng định dạng PDF");
    }
    setFile(e.file.originFileObj);
  };
  const onFinish = async (values) => {
    setSpin(true);
    try {
      const useCode = values.user_code;
      const studentMssv = infoUser?.student?.mssv;
      const compare = useCode.toLowerCase() === studentMssv.toLowerCase();
      if (!compare) {
        message.error("Vui lòng nhập đúng mã sinh viên của bạn");
      }
      const data = {
        ...values,
        support: value,
        typeNumber: 2,
        email: infoUser?.student?.email,
        ///dispatch Redux
      };

      if (value === 0) {
        const resData = await RegisterInternAPI.upload(data);
        message.success(resData.data.message);
        form.resetFields();
        setSpin(false);
      } else {
        await guardarArchivo(file, data);
      }
    } catch (error) {
      const dataErr = await error.response.data.message;
      message.error(dataErr);
      setSpin(false);
    }
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    dispatch(getListSpecialization());
    dispatch(getTimeForm(2));
    dispatch(getStudentId(infoUser.student.mssv));
  }, []);

  const check = time.endTime > new Date().getTime();
  const isCheck = student.statusCheck === 10 || student.statusCheck === 1;
  console.log(student);
  return (
    <>
      {check && <CountDownCustorm time={time} />}
      {spin ? <Spin /> : null}
      {check ? (
        isCheck ? (
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
              name="user_code"
              label="Mã sinh viên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã sinh viên",
                },
              ]}
            >
              <Input placeholder="Mã sinh viên" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Họ và Tên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ",
                },
              ]}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item
              name="majors"
              label="Ngành học"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngành học",
                },
              ]}
            >
              <Select
                style={{
                  width: "50%",
                  marginLeft: "20px",
                }}
                placeholder="Chọn ngành học"
              >
                {listSpecialization.map((item, index) => (
                  <Option value={item.name} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dream"
              label="Vị trí mong muốn"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ",
                },
              ]}
            >
              <Input placeholder="Vị trí mong muốn" />
            </Form.Item>
            <Form.Item name="support" label="Kiểu đăng ký">
              <Radio.Group onChange={onChange} defaultValue={value}>
                <Radio value={1}>Nhà trường hỗ trợ</Radio>
                <Radio value={0}>Tự tìm nới thực tập</Radio>
              </Radio.Group>
            </Form.Item>
            {value === 1 ? <Support normFile={normFile} /> : <Proactive />}
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        ) : (
          "Bạn đã đăng ký thông tin thực tập thành công"
        )
      ) : (
        <p>Thời gian đăng ký đã hết</p>
      )}
    </>
  );
};

export default SupportStudent;
