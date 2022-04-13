import React from "react";
import { Row, Col, Table } from "antd";
import { useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
const columns = [
  {
    title: "Doanh nghiệp",
    dataIndex: "company",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
];
const data = [
  {
    key: "1",
    company: "Công ty A",
    quantity: 32,
    address: "Hà Nội",
  },
  {
    key: "2",
    company: "Công ty B",
    quantity: 42,
    address: "Hà Nội",
  },
  {
    key: "3",
    company: "Công ty C",
    quantity: 32,
    address: "Hà Nội",
  },
  {
    key: "4",
    company: "Công ty D",
    quantity: 0,
    address: "Hà Nội",
  },
]; // rowSelection object indicates the need for row selection
function InfoStudent(props) {
  const { infoUser } = useSelector((state) => state.auth);
  console.log(infoUser);
  const isRegister = infoUser?.student?.typeRegister;
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(
  //       `selectedRowKeys: ${selectedRowKeys}`,
  //       "selectedRows: ",
  //       selectedRows
  //     );
  //   },
  // };

  return (
    <div>
      <Row>
        <Col span={10} className=" border-end p-2">
          <div>
            <h4>Thông tin đăng ký</h4>
          </div>
          <div className="border-top mt-3 pt-2">
            <p>Họ và tên : {infoUser?.student?.name}</p>
            <p>Ngành : {infoUser?.student?.majors}</p>
            <p>Khóa học : {infoUser?.student?.course}</p>
            <p>Email : {infoUser?.student?.email}</p>
            <p>
              Lựa chọn :{" "}
              {isRegister === 0
                ? "Tự tìm nới thực tập"
                : "" || isRegister === 1
                ? "Nhận hỗ trợ từ nhà trường"
                : ""}
            </p>
          </div>
        </Col>
        <Col span={10} className="ms-5 p-2">
          <h4>Chọn công ty</h4>
          <div>
            <Table rowKey="title" columns={columns} dataSource={data} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24} className=" mt-2 border-top ms-2">
          <h4 className="mt-2">Ghi chú</h4>
          <TextArea
            disabled={true}
            rows={10}
            value="Sửa lại lỗi CV, Vui lòng thêm 1-2 dự án mình đã làm"
            className="text-dark"
          ></TextArea>
        </Col>
      </Row>
    </div>
  );
}

export default InfoStudent;
