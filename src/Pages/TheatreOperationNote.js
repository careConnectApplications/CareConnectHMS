import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
} from '@chakra-ui/react';
import moment from 'moment';
import PreviewCard from '../Components/PreviewCard';
import PreviewCardV2 from '../Components/PreviewCardV2';
import Button from '../Components/Button';
import Input from '../Components/Input';
import ShowToast from '../Components/ToastNotification';
import { BsCalendar2DateFill } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import { SlPlus } from 'react-icons/sl';
import { BiSearch } from 'react-icons/bi';
import { IoFilter } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetOperationNoteByTheatreAdmissionApi } from '../Utils/ApiCalls';

export default function TheatreOperationNote({ hide = false, index }) {
  const [isLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState(null);
  const [showToast, setShowToast] = useState({
    show: false,
    message: '',
    status: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [filteredField, setFilteredField] = useState(null);
  const [all, setAll] = useState(true);

  const nav = useNavigate();
  const { pathname } = useLocation();
  const appointmentId = localStorage.getItem('appointmentId');

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 10000);
  };

  const fetchOperationNote = async () => {
    setIsLoading(true);
    try {
      const result = await GetOperationNoteByTheatreAdmissionApi(appointmentId);
      if (result.status === true && result.queryresult) {
        setData(result.queryresult);
      }
    } catch (e) {
      activateNotifications(e.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const AddNew = () => {
    localStorage.setItem('pathname', pathname);
    localStorage.setItem('appointmentId', appointmentId);
    nav(`/dashboard/add-new-operation-note/${appointmentId}`);
  };

  const EditRecord = () => {
    if (Data && Data._id) {
      localStorage.setItem('pathname', pathname);
      localStorage.setItem('oldoperationnotes', JSON.stringify(Data));
      nav(`/dashboard/edit-operation-note/${Data._id}`);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchOperationNote();
    } else {
      setIsLoading(false);
    }
  }, [index]);

  const handleAll = () => {
    setAll(true);
    setFilteredField(null);
    setSearchInput('');
  };

  const filterBy = (field) => {
    setAll(false);
    setFilteredField(field);
  };

  const clearFilter = () => {
    setAll(true);
    setFilteredField(null);
    setSearchInput('');
  };

  const shouldShowData = () => {
    if (!Data) return false;
    if (all || !filteredField || !searchInput.trim()) return true;
    const value = (Data[filteredField] || '').toString().toLowerCase();
    return value.includes(searchInput.toLowerCase());
  };

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={['18px', '18px']}
      rounded="10px"
    >
      {isLoading && <Text>Loading...</Text>}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Top bar: "All" filter on left, Search & Filter on right */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="10px">
        {/* "All" pill */}
        <Flex
          alignItems="center"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
          mt={['10px', '10px', '0px', '0px']}
          onClick={handleAll}
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px">
            <Text
              py="8.5px"
              px="12px"
              bg={all ? '#fff' : 'transparent'}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All
            </Text>
          </Box>
        </Flex>

        {/* Search & Filter on right */}
        <Flex
          flexWrap="wrap"
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack spacing={3}>
            <Input
              label="Search"
              leftIcon={<BiSearch />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              bColor="#E4E4E4"
            />

            <Menu isLazy>
              <MenuButton as={Box}>
                <HStack
                  border="1px solid #EA5937"
                  rounded="7px"
                  cursor="pointer"
                  py="11.64px"
                  px="16.98px"
                  bg="#f8ddd1"
                  color="blue.blue500"
                  fontWeight="500"
                  fontSize="14px"
                >
                  <Text>Filter</Text>
                  <IoFilter />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => filterBy('diagnosispreop')}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: '#fff',
                    fontWeight: '400',
                    bg: 'blue.blue500',
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>By Pre-op Diagnosis</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy('diagnosisoperative')}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: '#fff',
                    fontWeight: '400',
                    bg: 'blue.blue500',
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>By Operative Diagnosis</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy('surgeon')}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: '#fff',
                    fontWeight: '400',
                    bg: 'blue.blue500',
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>By Surgeon</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={clearFilter}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: '#fff',
                    fontWeight: '400',
                    bg: 'blue.blue500',
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Clear Filter</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      {/* Add/Edit button under "All" */}
      {!hide && (
        <Flex
          justifyContent="flex-start"
          flexWrap="wrap"
          mt="10px"
          w={['100%', '100%', '50%', '37%']}
        >
          {Data === null ? (
            <Button
              w={['100%', '100%', '144px', '144px']}
              onClick={AddNew}
              rightIcon={<SlPlus />}
            >
              Add New
            </Button>
          ) : (
            <Button
              w={['100%', '100%', '144px', '144px']}
              onClick={EditRecord}
              rightIcon={<MdModeEdit />}
            >
              Edit
            </Button>
          )}
        </Flex>
      )}

      {/* If filtered and no match */}
      {!isLoading && !all && !shouldShowData() && (
        <Text mt="20px">No matching record found.</Text>
      )}

      {/* Show Data when appropriate */}
      {shouldShowData() && Data && (
        <Box mt="20px">
          <HStack
            bg="orange.orange500"
            py="10px"
            px="10px"
            rounded="10px"
            color="blue.blue500"
            justifyContent="space-between"
            fontStyle="italic"
            fontSize="14px"
            fontWeight="500"
            mb="20px"
          >
            <HStack>
              <Box color="blue.blue500">
                <BsCalendar2DateFill />
              </Box>
              <Text>{moment(Data.createdAt).format('LL')}</Text>
            </HStack>
            <HStack>
              <Box color="blue.blue500">
                <FaClock />
              </Box>
              <Text>{moment(Data.createdAt).format('LT')}</Text>
            </HStack>
          </HStack>

          {/* Diagnosis: 2-column layout */}
          <Box mb="20px">
            <Text
              mb="10px"
              fontWeight="700"
              fontSize="15px"
              textTransform="capitalize"
              color="blue.blue500"
            >
              Diagnosis
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <PreviewCard
                title="Pre-op Diagnosis"
                value={Data.diagnosispreop}
              />
              <PreviewCard
                title="Operative Diagnosis"
                value={Data.diagnosisoperative}
              />
            </SimpleGrid>
          </Box>

          {/* Operative Details: 2-column layout */}
          <Box mb="20px">
            <Text
              mb="10px"
              fontWeight="700"
              fontSize="15px"
              textTransform="capitalize"
              color="blue.blue500"
            >
              Operative Details
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <PreviewCard title="Operative" value={Data.operative} />
              <PreviewCard title="Surgeon" value={Data.surgeon} />
              <PreviewCard
                title="Pre-op Nurse"
                value={Data.preoperativenurse}
              />
              <PreviewCard
                title="Anesthetic Nurse"
                value={Data.anestheticnurse}
              />
              <PreviewCard
                title="Type of Anesthetic"
                value={Data.typeofanesthetic}
              />
            </SimpleGrid>
          </Box>

          {/* Assistants */}
          {Data.assistants.length > 0 && (
            <Box mb="20px">
              <Text
                mb="10px"
                fontWeight="700"
                fontSize="15px"
                textTransform="capitalize"
                color="blue.blue500"
              >
                Assistants
              </Text>
              {Data.assistants.map((item, i) => (
                <Box key={i} mb="5px">
                  <PreviewCardV2 title="" value={item} />
                </Box>
              ))}
            </Box>
          )}

          {/* Findings */}
          {Data.findings.length > 0 && (
            <Box mb="20px">
              <Text
                mb="10px"
                fontWeight="700"
                fontSize="15px"
                textTransform="capitalize"
                color="blue.blue500"
              >
                Findings
              </Text>
              {Data.findings.map((item, i) => (
                <Box key={i} mb="5px">
                  <PreviewCardV2 title="" value={item} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
