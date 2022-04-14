import React, { useState, useEffect, useCallback } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import '../../common/styles/status.css';
import { Select, Input, Table, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent } from '../../features/StudentSlice/StudentSlice';
import {
  getListStudentAssReviewer,
  updateReviewerListStudent,
  updateStatusListStudent,
} from '../../features/reviewerStudent/reviewerSlice';
import { filterBranch, filterStatuss } from '../../ultis/selectOption';
import { omit } from 'lodash';

const { Option } = Select;

const ReviewCV = () => {
  const dispatch = useDispatch();
  const { infoUser } = useSelector((state) => state.auth);
  const {
    listStudentAssReviewer: { total, list },
    loading,
  } = useSelector((state) => state.reviewer);

  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [status, setStatus] = useState({});
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.cumpus,
  });
  const [filter, setFiler] = useState({});
  useEffect(() => {
    const data = {
      ...page,
      ...filter,
    };
    setChooseIdStudent([]);
    dispatch(getListStudentAssReviewer(data));
  }, [page, dispatch]);

  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'mssv',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      width: 160,
    },
    {
      title: 'Ngành',
      dataIndex: 'majors',
      width: 100,
    },
    {
      title: 'Phân loại',
      dataIndex: 'support',
      width: 90,
      render: (val) => {
        if (val === 1) {
          return 'Hỗ trợ';
        } else if (val === 0) {
          return 'Tự tìm';
        } else {
          return '';
        }
      },
    },
    {
      title: 'CV',
      dataIndex: 'CV',
      width: 50,
      render: (val) =>
        val ? <EyeOutlined className="icon-cv" onClick={() => window.open(val)} /> : '',
    },
    {
      title: 'Người review',
      dataIndex: 'reviewer',
      width: 230,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusCheck',
      render: (status) => {
        if (status === 0) {
          return (
            <span className="status-check" style={{ color: 'orange' }}>
              Chờ kiểm tra <br />
            </span>
          );
        } else if (status === 1) {
          return (
            <span className="status-check" style={{ color: 'orange' }}>
            Sửa lại
          </span>
          )
        } else if (status === 2) {
          return (
            <span className="status-fail" style={{ color: 'green' }}>
              Nhận Cv <br />
            </span>
          );
        } else if (status === 3) {
          return (
            <span className="status-true" style={{ color: 'red' }}>
              Không đủ Đk <br />
            </span>
          );
        } else if (status === 4) {
          <span className="status-true" style={{ color: 'red' }}>
            Trượt <br />
          </span>;
        } else {
          return (
            <span className="status-true" style={{ color: 'red' }}>
              Chưa đăng ký
            </span>
          );
        }
      },
    },
  ];
  // xóa tìm kiếm
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListIdStudent(selectedRowKeys);
      setChooseIdStudent(selectedRows);
    },
  };

  const handleStandardTableChange = (key, value) => {
    const newValue =
      value.length > 0 || value > 0
        ? {
            ...filter,
            [key]: value,
          }
        : omit(filter, [key]);
    setFiler(newValue);
  };
  const handleSearch = () => {
    const data = {
      ...page,
      ...filter,
    };
    dispatch(getStudent(data));
  };

  const actionOnchange = (value) => {
    switch (value) {
      case 'assgin':
        dispatch(
          updateReviewerListStudent({
            listIdStudent: listIdStudent,
            email: infoUser?.manager?.email,
          }),
        );
        setStatus([]);
        alert('Thêm thành công ');
        break;
      case 'edit':
        setStatus({
          listIdStudent: listIdStudent,
          email: infoUser?.manager?.email,
        });
        break;

      default:
        break;
    }
  };

  const selectStatus = (value) => {
    setStatus({
      listIdStudent: listIdStudent,
      email: infoUser?.manager?.email,
      status: value,
    });
  };

  const comfirm = () => {
    dispatch(updateStatusListStudent(status));
    setChooseIdStudent([]);
  };

  return (
    <div className="status">
      <h4>Review CV</h4>

      <div className="filter">
        <span>Ngành: </span>

        <Select
          style={{ width: 200 }}
          onChange={(val) => handleStandardTableChange('majors', val)}
          placeholder="Lọc theo ngành"
        >
          {filterBranch.map((item, index) => (
            <Option value={item.value} key={index + 1}>
              {item.title}
            </Option>
          ))}
        </Select>
        <span
          style={{
            marginLeft: '30px',
          }}
        >
          Trạng thái:
        </span>
        <Select
          className="filter-status"
          style={{ width: 200 }}
          onChange={(val) => handleStandardTableChange('statusCheck', val)}
          placeholder="Lọc theo trạng thái"
        >
          {filterStatuss.map((item, index) => (
            <Option value={index} key={index}>
              {item.title}
            </Option>
          ))}
        </Select>
        <Select
          className="filter-status"
          style={{ width: 200 }}
          onChange={(val) => handleStandardTableChange('classify', val)}
          placeholder="Lọc theo phân loại"
        >
          <Option value="0" key="1">
            Tự tìm
          </Option>
          <Option value="1" key="2">
            Nhờ nhà trường
          </Option>
        </Select>
        <span
          style={{
            marginLeft: '30px',
          }}
        >
          Tìm Kiếm:{' '}
        </span>
        <Input
          style={{ width: 200 }}
          placeholder="Tìm kiếm theo tên"
          onChange={(val) => handleStandardTableChange('name', val.target.value)}
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
        {chooseIdStudent.length > 0 && (
          <div className="comfirm">
            <span>Lựa chọn:</span>
            <Select
              className="comfirm-click"
              style={{ width: 100 }}
              onChange={actionOnchange}
              placeholder="Chọn"
            >
              <Option value="assgin" key="1">
                Kéo việc
              </Option>
              <Option value="edit" key="2">
                Sửa lại
              </Option>
            </Select>

            {Object.keys(status).length >= 1 && (
              <Select
                className="upload-status"
                style={{ width: 150 }}
                onChange={(e) => selectStatus(e)}
                placeholder="Chọn trạng thái"
              >
                <Option value="1" key="1">
                  Sửa lại
                </Option>
                <Option value="2" key="2">
                  Đã nhận
                </Option>
                <Option value="3" key="3">
                  Không đủ điều kiện
                </Option>
                <Option value="4" key="4">
                  Trượt
                </Option>
              </Select>
            )}

            <Button onClick={() => comfirm()}>Xác nhận</Button>
          </div>
        )}
      </div>

      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        pagination={{
          pageSize: page.limit,
          total: total,
          onChange: (pages, pageSize) => {
            setPage({
              ...page,
              page: pages,
              limit: pageSize,
              ...filter,
            });
          },
        }}
        rowKey={(val) => val._id}
        loading={loading}
        columns={columns}
        dataSource={list}
        scroll={{ x: 'calc(700px + 50%)' }}
      />
    </div>
  );
};

export default ReviewCV;