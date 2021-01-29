import { DownloadIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ChakraProvider,
  Center,
  Flex,
  Heading,
  HStack,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Mousetrap from "mousetrap";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FaGithub } from "react-icons/fa";

import {
  downloadPDFLink,
  personalInfo,
  degrees,
  jobs,
  awards,
} from "./resume.json";

// https://chakra-ui.com/docs/features/responsive-styles
const COLUMN_WIDTH = [100, 150, 250, 305];
const ITEM_HEADER_FONT_SIZE = [8, 10, 16, 20];
const SECTION_HEADER_FONT_SIZE = [8, 12, 18, 24];
const LIST_ITEM_FONT_SIZE = [8, 12, 14, 18];
const PERSONAL_INFO_FONT_SIZE = [6, 10, 14, 18];
const NAME_FONT_SIZE = [12, 16, 34, 46];

type Degree = {
  id: string; // Used for setting "key" attribute
  title: string;
  schoolName: string;
  enrollmentDateRange: {
    startDateStr: string;
    endDateStr?: string;
  };
  description: string[]; // Bullet points
};

type Job = {
  id: string; // Used for setting "key" attribute
  role: string;
  companyName: string;
  employmentDateRange: {
    startDateStr: string;
    endDateStr?: string;
  };
  description: string[]; // Bullet points
  technologies?: string[]; // Adds a {technologiesSeparator = 'comma'}-separated list to the bottom
  technologiesSeparator?: string;
};

type GenericSection = {
  id: string; // Used for setting "key" attribute
  columnHeader1: string;
  columnHeader2: string;
  columnHeader3: string;
  description: string[]; // Bullet points
};

type Award = GenericSection;

const get3ColumnHeaderElement = (
  first: string,
  second: string,
  third: string
) => (
  <HStack
    align="center"
    justify="space-between"
    fontWeight="bold"
    fontSize={ITEM_HEADER_FONT_SIZE}
    mb="2"
  >
    <Box w={COLUMN_WIDTH} textAlign="left">
      {first}
    </Box>
    <Box w={COLUMN_WIDTH} textAlign="center">
      <Center>{second}</Center>
    </Box>
    <Box w={COLUMN_WIDTH} textAlign="right">
      {third}
    </Box>
  </HStack>
);

const getListElement = (description: string[]) => (
  <List spacing="1" pl="4">
    {description.map((descriptionItem: string) => (
      <ListItem
        key={`${descriptionItem.substr(0, 10).replace(" ", "-")}`}
        fontSize={LIST_ITEM_FONT_SIZE}
      >
        {`- ${descriptionItem}`}
      </ListItem>
    ))}
  </List>
);

const getTechnologiesElement = (
  technologies: string[],
  technologiesSeparator = ", "
) => (
  <Flex pl="4" pt="1" fontWeight="bold" fontSize={LIST_ITEM_FONT_SIZE}>
    Technologies:
    <Text as="i" ml="2">
      {technologies.join(technologiesSeparator)}
    </Text>
  </Flex>
);

const Resume = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    Mousetrap.bind("t", () => toggleColorMode());

    return () => {
      Mousetrap.unbind("t");
    };
  }, [colorMode, toggleColorMode]);

  const { name, email, phone, social } = personalInfo;
  const personalInfoHeader = (
    <HStack
      align="center"
      justify="space-between"
      fontWeight="semibold"
      fontSize="lg"
    >
      <Box w={COLUMN_WIDTH} textAlign="left">
        <Stack spacing="1px" fontSize={PERSONAL_INFO_FONT_SIZE}>
          <a href={`mailto:${email}`}>
            <Text isTruncated _hover={{ textDecoration: "underline" }}>
              {email}
            </Text>
          </a>
          <Text>{phone}</Text>
        </Stack>
      </Box>
      <Box w={COLUMN_WIDTH} textAlign="center">
        <Center>
          <Text fontSize={NAME_FONT_SIZE}>{name}</Text>
        </Center>
      </Box>
      <Box w={COLUMN_WIDTH} textAlign="right">
        <Stack spacing="1px" fontSize={PERSONAL_INFO_FONT_SIZE}>
          {social["github"] && (
            <Link href={social["github"].url} isExternal>
              <Flex justifyContent="flex-end">
                GitHub <ExternalLinkIcon mx="2px" mt="3px" />
              </Flex>
            </Link>
          )}
          {social["linkedin"] && (
            <Link href={social["linkedin"].url} isExternal>
              <Flex justifyContent="flex-end">
                LinkedIn <ExternalLinkIcon mx="2px" mt="3px" />
              </Flex>
            </Link>
          )}
        </Stack>
      </Box>
    </HStack>
  );

  const dividerColor = useColorModeValue("black", "white");
  const divider = (
    <Box backgroundColor={dividerColor} width="100%" height="2px" mb={2} />
  );

  const employmentSection = (
    <>
      <Heading fontSize={SECTION_HEADER_FONT_SIZE}>Employment</Heading>
      {divider}
      {Object.values(jobs).map((job: Job) => {
        return (
          <Box key={job.id} marginBottom="3">
            {get3ColumnHeaderElement(
              job.role,
              job.companyName,
              `${job.employmentDateRange.startDateStr} - ${
                job.employmentDateRange.endDateStr || "Present"
              }`
            )}
            {getListElement(job.description)}
            {job.technologies && job.technologies.length
              ? getTechnologiesElement(
                  job.technologies,
                  job.technologiesSeparator
                )
              : null}
          </Box>
        );
      })}
    </>
  );

  const educationSection = (
    <>
      <Heading fontSize={SECTION_HEADER_FONT_SIZE}>Education</Heading>
      {divider}
      {Object.values(degrees).map((degree: Degree) => {
        return (
          <Box key={degree.id} marginBottom="3">
            {get3ColumnHeaderElement(
              degree.title,
              degree.schoolName,
              `${degree.enrollmentDateRange.startDateStr} - ${
                degree.enrollmentDateRange.endDateStr || "Present"
              }`
            )}
            {getListElement(degree.description)}
          </Box>
        );
      })}
    </>
  );

  const awardsSection = (
    <>
      <Heading fontSize={SECTION_HEADER_FONT_SIZE}>Awards</Heading>
      {divider}
      {Object.values(awards).map((award: Award) => {
        return (
          <Box key={award.id} marginBottom="3">
            {get3ColumnHeaderElement(
              award.columnHeader1,
              award.columnHeader2,
              award.columnHeader3
            )}
            {getListElement(award.description)}
          </Box>
        );
      })}
    </>
  );

  const footer = (
    <Center mt={10}>
      <Button
        aria-label="Download Resume"
        border="1px solid black"
        colorScheme="blue"
        onClick={() => {
          window.open(downloadPDFLink, "_blank");
        }}
      >
        <DownloadIcon />
        <Text ml={2}>PDF</Text>
      </Button>
      <Button
        aria-label="Download Resume"
        border="1px solid black"
        ml={2}
        onClick={() => {
          window.open(
            "https://github.com/KrammerJake/good-software-engineer-resume.com",
            "_blank"
          );
        }}
      >
        <FaGithub />
        <Text ml={2}>Code</Text>
      </Button>
    </Center>
  );

  return (
    <Box margin="auto" px={[4, 10]} py={[8, 20]} maxW="1200px">
      {personalInfoHeader}
      {employmentSection}
      {educationSection}
      {awardsSection}
      {footer}
    </Box>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Resume />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
