import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import TableRowY from "../Components/TableRowY";
import { ReadAllAuditApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function AuditManagement() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage; // Use posts per page from configuration
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  // Fetch all audit details
  const getAllAuditDetails = async () => {
    try {
      const result = await ReadAllAuditApi();
      console.log("Audit details:", result);
      // Assuming the API response structure:
      // result.queryresult.auditdetails
      setData(result.queryresult.auditdetails);
      setFilterData(result.queryresult.auditdetails);
    } catch (error) {
      activateNotifications(error.message, "error");
    }
  };

  // Notification function
  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getAllAuditDetails();
  }, []);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
      rounded="10px"
    >
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Table Section */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
              <Th fontSize="13px" color="#534D59" fontWeight="600">
                  S/N
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Action
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actor
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Affected Entity
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Created Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Updated Date
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item,i) => (
                <TableRowY
                  key={item._id}
                  type="audit"
                  sn={i + 1}
                  action={item.action}
                  actor={item.actor}
                  affectedEntity={item.affectedentity}
                  createdAt={item.createdAt}
                  updatedAt={item.updatedAt}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      <Pagination
        postPerPage={postsPerPage}
        currentPage={currentPage}
        totalPosts={filterData.length}
        paginate={paginate}
      />
    </Box>
  );
}
