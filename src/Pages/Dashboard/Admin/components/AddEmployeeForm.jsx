import React from "react";
import { Modal, Input, Form, Button } from "antd";

const AddEmployeeForm = ({ visible, onCancel, onAddEmployee }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onAddEmployee(values);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  return (
    <Modal
      title="Add Employee"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" danger onClick={handleOk}>
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeForm;
