import React, { useState, useEffect } from "react";
import AddEmployeeForm from "./components/AddEmployeeForm";
import { Table, Button, Switch, Modal, Layout, Typography, Input } from "antd";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import "../Admin/components/Css/Admin.css"

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
  const [unblockConfirmationVisible, setUnblockConfirmationVisible] =
    useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
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
        <div className="actions-container">
          <Button onClick={() => showDetails(record)}>Details</Button>
          <Switch
            className={`action-button ${
              record.blocked ? "checked" : "unchecked"
            }`}
            checkedChildren="Block"
            unCheckedChildren="Unblock"
            defaultChecked={!record.blocked}
            onChange={(unchecked) =>
              unchecked
                ? showUnblockConfirmation(record)
                : showBlockConfirmation(record)
            }
          />
          <Button
            type="primary"
            danger
            icon={<RiDeleteBin6Fill />}
            onClick={() => showDeleteConfirmation(record)}
          />
        </div>
      ),
    },
  ];

  const handleAddEmployee = async (values) => {
    try {
      
      const newEmployee = {
        id: Date.now(),
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        blocked: false,
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
    showBlockConfirmation(currentEmployee);
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
          ? { ...employee, blocked: true }
          : employee
      );

      // Update the local state to reflect the change
      setEmployees(updatedEmployees);
    }

    // Close the block confirmation modal
    setBlockConfirmationVisible(false);
  };

 const handleUnblockConfirmation = (confirm) => {
   if (confirm) {
     // Simulate the unblock confirmation locally
     const updatedEmployees = employees.map((employee) =>
       employee.id === selectedEmployee.id
         ? { ...employee, blocked: false }
         : employee
     );

     // Update the local state to reflect the change
     setEmployees(updatedEmployees);
   }

   // Close the unblock confirmation modal
   setUnblockConfirmationVisible(false);
 };


  const handleDeleteConfirmation = async (confirm) => {
    if (confirm) {
      try {
        // Send a DELETE request to the server
        await axios.delete(
          `https://jsonplaceholder.typicode.com/users/${selectedEmployee.id}`
        );

        // Update the local state to remove the deleted employee
        setEmployees((prevEmployees) =>
          prevEmployees.filter(
            (employee) => employee.id !== selectedEmployee.id
          )
        );
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }

    // Close the delete confirmation modal
    setDeleteConfirmationVisible(false);
  };

  const showBlockConfirmation = (employee) => {
    setSelectedEmployee(employee);
    setBlockConfirmationVisible(true);
    setUnblockConfirmationVisible(false); 
  };

const showUnblockConfirmation = (employee) => {
  setSelectedEmployee(employee);
  setUnblockConfirmationVisible(true);
};



  const showDeleteConfirmation = (employee) => {
    setSelectedEmployee(employee);
    setDeleteConfirmationVisible(true);
  };

  return (
    <Layout className="max-width">
      <Header className="header">
        <Title level={4} className="title">
          Asif.inc Employee List
        </Title>
      </Header>
      <Content className="custom-content">
        <div className="custom-flex">
          <Button type="primary" danger onClick={() => setAddFormVisible(true)}>
            + Add Employee
          </Button>
        </div>
        <Table
          dataSource={employees}
          columns={columns}
          className="tableWrapper"
          pagination={{
            current: 1,
            pageSize: 10, 
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
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              danger
              onClick={handleSaveDetails}
            >
              {" "}
              Save
            </Button>,
          ]}
        >
          {selectedEmployee && (
            <div>
              <p>
                <strong>Full Name:</strong>
                <Input
                  value={selectedEmployee.name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      name: e.target.value,
                    })
                  }
                />
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Phone:</strong>
                <Input
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

        <Modal
          title="Block Confirmation"
          open={blockConfirmationVisible}
          onCancel={() => setBlockConfirmationVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setBlockConfirmationVisible(false)}
            >
              Cancel
            </Button>,
            <Button
              key="block"
              type="primary"
              danger
              onClick={() => handleBlockConfirmation(true)}
            >
              Block
            </Button>,
          ]}
        >
          <p>Are you sure you want to block this employee?</p>
        </Modal>

        <Modal
          title="Unblock Confirmation"
          open={unblockConfirmationVisible}
          onCancel={() => setUnblockConfirmationVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setUnblockConfirmationVisible(false)}
            >
              Cancel
            </Button>,
            <Button
              key="unblock"
              type="primary"
              danger
              onClick={() => handleUnblockConfirmation(true)}
            >
              Unblock
            </Button>,
          ]}
        >
          <p>Are you sure you want to unblock this employee?</p>
        </Modal>

        <Modal
          title="Delete Confirmation"
          open={deleteConfirmationVisible}
          onCancel={() => setDeleteConfirmationVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setDeleteConfirmationVisible(false)}
            >
              Cancel
            </Button>,
            <Button
              key="delete"
              type="primary"
              danger
              onClick={() => handleDeleteConfirmation(true)}
            >
              Delete
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete this employee?</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeList;
