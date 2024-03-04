import React, { useState, useEffect } from "react";
import AddEmployeeForm from "./components/AddEmployeeForm";
import { Table, Button, Switch, Modal, Layout, Typography } from "antd";
import axios from "axios";

const { Header, Content } = Layout;
const { Title } = Typography;

const EmployeeList = () => {
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [blockConfirmationVisible, setBlockConfirmationVisible] =
    useState(false);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button onClick={() => showDetails(record)}>Details</Button>
          <Switch
            checkedChildren="Block"
            unCheckedChildren="Unblock"
            defaultChecked={!record.blocked}
            onChange={() => showBlockConfirmation(record)}
          />
          <Button
            type="danger"
            icon="delete"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  const handleAddEmployee = async (values) => {
    try {
      // Simulate the addition locally (since JSONPlaceholder doesn't support POST)
      const newEmployee = {
        id: Date.now(),
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        blocked: false, // Set the initial status to 'active' and 'unblocked'
      };

      // Update the local state to include the new employee at the beginning
      setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
    } catch (error) {
      console.error("Error adding employee:", error);
    }

    // Close the form after adding an employee
    setAddFormVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showDetails = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const handleBlockToggle = async (employeeId) => {
    try {
      const currentEmployee = employees.find(
        (employee) => employee.id === employeeId
      );

      // Show the block confirmation modal
      setSelectedEmployee(currentEmployee);
      setBlockConfirmationVisible(true);
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      // Send a DELETE request to the server
      await axios.delete(
        `https://jsonplaceholder.typicode.com/users/${employeeId}`
      );

      // Update the local state to remove the deleted employee
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSaveDetails = async () => {
    try {
      if (!selectedEmployee) {
        // No selected employee, return early
        return;
      }

      // Simulate the update locally (since JSONPlaceholder doesn't support PUT)
      const updatedEmployees = employees.map((employee) =>
        employee.id === selectedEmployee.id
          ? { ...employee, ...selectedEmployee }
          : employee
      );

      // Update the local state to reflect the changes
      setEmployees(updatedEmployees);

      // Close the modal after saving details
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving employee details:", error);
    }
  };

  const handleBlockConfirmation = (confirm) => {
    if (confirm) {
      // Simulate the block confirmation locally
      const updatedEmployees = employees.map((employee) =>
        employee.id === selectedEmployee.id
          ? { ...employee, blocked: !employee.blocked }
          : employee
      );

      // Update the local state to reflect the change
      setEmployees(updatedEmployees);
    }

    // Close the block confirmation modal
    setBlockConfirmationVisible(false);
  };

  const showBlockConfirmation = (employee) => {
    setSelectedEmployee(employee);
    setBlockConfirmationVisible(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ background: "#fff", padding: "16px", textAlign: "center" }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Asif.inc Employee Dashboard
        </Title>
      </Header>
      <Content style={{ padding: "16px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Button type="primary" onClick={() => setAddFormVisible(true)}>
            Add Employee
          </Button>
        </div>
        <Table
          dataSource={employees}
          columns={columns}
          pagination={{
            current: 1, // Set the current page to 1 after adding an employee
            pageSize: 10, // Adjust the pageSize according to your requirements
          }}
        />
        {/* Modal for adding employee */}
        <AddEmployeeForm
          visible={isAddFormVisible}
          onCancel={() => setAddFormVisible(false)}
          onAddEmployee={handleAddEmployee}
        />
        {/* Modal for viewing employee details */}
        <Modal
          title="Employee Details"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSaveDetails}
        >
          {selectedEmployee && (
            <div>
              <p>
                Full Name:{" "}
                <input
                  type="text"
                  value={selectedEmployee.name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      name: e.target.value,
                    })
                  }
                />
              </p>
              <p>Email: {selectedEmployee.email}</p>
              <p>
                Phone:{" "}
                <input
                  type="text"
                  value={selectedEmployee.phone}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      phone: e.target.value,
                    })
                  }
                />
              </p>
            </div>
          )}
        </Modal>
        {/* Modal for block confirmation */}
        <Modal
          title="Block Confirmation"
          visible={blockConfirmationVisible}
          onCancel={() => setBlockConfirmationVisible(false)}
          onOk={() => handleBlockConfirmation(true)}
        >
          <p>Are you sure you want to block this employee?</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeList;
