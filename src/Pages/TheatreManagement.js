import React, { useState, useEffect } from "react";
import { Text, Flex, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import CreateTheatreModal from "../Components/CreateTheatreModal";
import ShowToast from "../Components/ToastNotification";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { GetAllTheatreApi, UpdatePriceStatusApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function TheatreManagement() {
  const [all, setAll] = useState(true);
  const [active, setActive] = useState(false);
  const [inActive, setInActive] = useState(false);
  const [data, setData] = useState([]);
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const [filterData, setFilterData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
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

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch all theatre details
  const getAllTheatre = async () => {
    try {
      const result = await GetAllTheatreApi();
      console.log("getAllTheatre", result);
      setData(result.queryresult.theatremanagementdetails);
      setFilterData(result.queryresult.theatremanagementdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  // Notification function
  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  // Filter functions
  const filterAll = () => {
    setAll(true);
    setActive(false);
    setInActive(false);
    setFilterData(data);
  };

  const filterActive = () => {
    setAll(false);
    setActive(true);
    setInActive(false);
    const filtered = data.filter((item) => item.status === "active");
    setFilterData(filtered);
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);
    const filtered = data.filter((item) => item.status === "inactive");
    setFilterData(filtered);
  };


  // Status change function
  const onChangeStatus = async (id) => {
    try {
      const result = await UpdatePriceStatusApi(id);
      if (result.status === 200) {
        setTrigger(!trigger);
        setShowToast({
          show: true,
          message: "Status Updated Successfully",
          status: "success",
        });
        setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
      }
    } catch (err) {
      // Handle errors if necessary
    }
  };

  // Open modal to create a new theatre entry
  const createTheatre = () => {
    setModalState("new");
    onOpen();
  };

  // Open modal to edit a theatre entry
  const editTheatre = (item) => {
    setModalState("edit");
    onOpen();
    setOldPayload(item);
  };

  useEffect(() => {
    getAllTheatre();
  }, [isOpen, trigger]);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Filter Section */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text
              py="8.5px"
              px="12px"
              bg={all ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All{" "}
              <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                ({data?.length})
              </Box>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActive}>
            <Text
              py="8.5px"
              px="12px"
              bg={active ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Active
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInactive}>
            <Text
              py="8.5px"
              px="12px"
              bg={inActive ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Inactive
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Flex justifyContent="space-between" flexWrap="wrap" mt="10px" w={["100%", "100%", "50%", "37%"]}>
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "165px", "205px"]} onClick={createTheatre}>
          Add Theatre
        </Button>
      </Flex>

      {/* Table Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">S/N</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Created Date</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Bed Specialization</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Theatre Name</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Total Bed</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Occupied Bed</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Vacant Bed</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Status</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <TableRowY
                  key={i}
                  type="theatre-management"
                  sn={i + 1}
                  date={moment(item.createdAt).format("lll")}
                  bedSpecialization={item.bedspecialization}
                  wardName={item.theatrename}
                  totalBed={item.totalbed}
                  occupiedBed={item.occupiedbed}
                  vacantBed={item.vacantbed}
                  status={item.status}
                  onEdit={() => editTheatre(item)}
                  onChangeStatus={() => onChangeStatus(item._id)}
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

      <CreateTheatreModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
