import React, { useEffect, useRef, useState } from "react"
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { Grid, Box, IconButton, Typography, Paper } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DynamicPageTextField from "../../components/dynamic-page-v1/textfield";
import DynamicPageCheckboxField from "../../components/dynamic-page-v1/check-box";
import DynamicPageRadioButton from "../../components/dynamic-page-v1/radio-button-group";
import { useDispatch, useSelector } from 'react-redux'
import { ExternalInputs } from "../../constants";
import dynamicPageFieldValue from '../../redux/reducers/dynamic-page-field-values'
import { useKeyboard } from "../../hooks/useKeyboard";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { openOnboardKeyboard, toggleOnboardKeyboard, closeOnboardKeyboard } from "../../services/keyboard.service";

const removeEmptyKeys = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      value = value.trim();
    } else if (typeof value === 'boolean' && value === false) {
      value = "";
    }

    if (value !== "") {
      acc[key] = value;
    }

    return acc;
  }, {});
};

/**
 * This function will remove all empty key-value pair for object.
 * If that page object itself empty then assign empty string to that object
 * @param {*} data 
 * @returns 
 */
// TODO need to rework
const getDynamicPageData = (data) => {
  const newData = {};
  data.forEach((item) => {
    const result = removeEmptyKeys(item.values);
    newData[item.page] = Object.keys(result).length === 0 ? '' : result
  })
  return newData
}

function CurrentDynamicPage(props) {

  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);
  const dispatch = useDispatch()
  const focusIndex = useRef(0)
  const propertyRefs = useRef([]);

  const [showKeyboard, hideKeyboard] = useKeyboard()


  useEffect(() => {
    const elementType = props.properties[0].content.props.schema.type;
    const totalLength = elementType ? props.properties.length : props.properties[0].content.props.schema.enum.length;

    // Create an array with refs for all elements
    propertyRefs.current = Array.from({ length: totalLength }, (_, index) =>
      propertyRefs.current[index] || React.createRef()
    );

  }, []);

  const isFirst = useRef(true)
  const handleExternalInput = () => {
    if (isFirst.current) {
      isFirst.current = false
      return;
    }

    if (externalInputValue === ExternalInputs.NEXT) {
      handleNextFocus()
    }
  }

  const handleNextFocus = () => {
    focusIndex.current = (focusIndex.current + 1) % propertyRefs.current.length;

    if (propertyRefs.current[focusIndex.current]?.focus) {
      propertyRefs.current[focusIndex.current].focus();
    }
  }

  const handleTextFieldFocus = (index) => {
    focusIndex.current = index;
  }

  useEffect(() => {
    handleExternalInput();
  }, [externalInputValue, externalInputCounter])

  useEffect(() => {
    const elementType = props.properties[0].content.props.schema.type;
    if (elementType === 'string') {
      propertyRefs.current[0]?.focus();
      showKeyboard()
    }
  }, [props])

  useEffect(() => {
    return () => {
      closeOnboardKeyboard();
    };
  }, []);

  const { data: selectedValue } = useSelector((state) => state.dynamicPageFieldValues)

  const setSelectedValue = (key, value) => {
    dispatch(dynamicPageFieldValue.actions.updateFieldDataFromChild({ keyData: key, valueData: value }));
  }

  return (
    <Grid container direction="column">
      <Grid item sx={{ padding: 4 }}>
        <Typography variant="h1" sx={{ wordBreak: 'break-all', wordWrap: 'break-word' }} >{props.title}</Typography>
      </Grid>
      <Grid item container direction="row" name={props.name}>
        {props.properties.map((element, index) => {
          const elementType = element.content.props.schema.type
          if (elementType === 'string') {
            return <DynamicPageTextField
              key={index}
              element={element}
              textValue={selectedValue}
              setTextValue={setSelectedValue}
              ref={(el) => {
                (propertyRefs.current[index] = el)
              }}
              handleTextFieldFocus={() => handleTextFieldFocus(index)}
            />
          } else if (elementType === 'boolean') {
            return <DynamicPageCheckboxField
              key={index}
              element={element}
              checkboxValue={selectedValue}
              setCheckboxValue={setSelectedValue}
              index={index}
            />
          } else {
            return (
              <React.Fragment key={index}>
                {element.content.props.schema.enum.map((option, optionIndex) =>
                  <DynamicPageRadioButton
                    key={optionIndex}
                    element={element}
                    radioValue={selectedValue}
                    setRadioValue={setSelectedValue}
                    optionValue={option}
                    ref={(el) => (propertyRefs.current[optionIndex] = el)}
                    index={optionIndex}
                  />
                )}
              </React.Fragment>)
          }
        })}
      </Grid>
    </Grid>
  );
}

function ObjectFieldTemplate(props) {
  return (
    <CurrentDynamicPage
      {...props}
    />)
}

export default function DynamicPages({ onComplete, onAction }) {

  const { workflow } = useSelector((state) => state.workflow);
  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);

  const [page, setPage] = useState(0) //pages initial 0
  const [schema, setSchema] = useState(workflow?.ui_config?.dynamic_pages?.[0]?.jsnSchema) //schema initial userInput 0 

  const [showKeyboard, hideKeyboard] = useKeyboard()

  //initialise the parentData
  const formDatapages = workflow?.ui_config?.dynamic_pages?.map((input) => {
    const formData = Object.entries(input?.jsnSchema?.properties).reduce((acc, [key, value]) => {
      if (value.enum) {
        value.enum.map((item) => {
          acc[item] = "";
        })
      }
      else {
        acc[key] = "";
      }
      return acc;
    }, {});

    return {
      page: input?.jsnSchema?.title,
      values: formData
    };
  });
  const { data: currentPageData } = useSelector((state) => state.dynamicPageFieldValues)
  const dispatch = useDispatch()

  const [parentData, setParentData] = useState(formDatapages) //parentData  format 
  const lengthValue = workflow?.ui_config?.dynamic_pages?.length;

  const handleNextPageClick = () => {
    hideKeyboard()
    if (page + 1 <= lengthValue) {
      parentData[page].values = { ...currentPageData }
      setPage(page + 1)
    }
    onAction(true);
  }

  const handlePrevPageClick = () => {
    hideKeyboard()
    if (page - 1 >= 0) {
      parentData[page].values = { ...currentPageData }
      setPage(page - 1)
    }
  }

  const isFirst = useRef(true)
  const handleExternalInput = () => {
    if (isFirst.current) {
      isFirst.current = false
      return;
    }

    if (externalInputValue === ExternalInputs.SKIP) {
      handleNextPageClick()
    }
  }

  //virtual keyboard
  const { open: keyboardOpen } = useSelector((state) => state.keyboard)

  const handleKeyboardClick = () => {
    toggleOnboardKeyboard();
  }

  useEffect(() => {
    handleExternalInput();
  }, [externalInputValue, externalInputCounter])

  useEffect(() => {
    if (page < lengthValue) {
      setSchema(workflow?.ui_config?.dynamic_pages?.[page]?.jsnSchema)
      dispatch(dynamicPageFieldValue.actions.updateFieldData({ data: parentData[page].values }));
    }
    if (page === lengthValue) {
      const result = getDynamicPageData(parentData)
      onComplete(result);
    }
  }, [page, workflow])

  useEffect(() => {
    if (Object.values(currentPageData).join('').length !== 0) {
      onAction(true);
    }
  }, [currentPageData])

  useEffect(() => {
    dispatch(dynamicPageFieldValue.actions.updateFieldData({ data: parentData[0].values }));

    return () => {
      dispatch(dynamicPageFieldValue.actions.resetFieldData());
    }

  }, [])

  const paperStyle = {
    outline: 'none' // Remove the focus outline when focused
  };

  return (
    <Grid container padding={5} height={'90vh'} style={paperStyle}>
      <Grid item xs={12} height={'85%'} >
        {page < lengthValue &&
          <Paper variant="outlined" sx={{ padding: 4, height: '100%', overflow: 'auto' }}>
            <Form
              schema={schema}
              validator={validator}
              templates={{ ObjectFieldTemplate }} >
              <React.Fragment />{/* not to render the submit button */}
            </Form>
          </Paper>
        }
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={4} display={'flex'} alignItems={'center'}>
          <Box sx={{ visibility: page > 0 && page < lengthValue ? 'visible' : 'hidden' }}>
            <IconButton size="large" onClick={handlePrevPageClick} sx={{ margin: 'auto' }}>
              <ArrowBackIosNewIcon color="primary" sx={{ fontSize: '3.5em' }} />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={4} display={'flex'} justifyContent={'center'}>
          {

            Object.values(schema?.properties)?.[0]?.type === 'string' &&
            <IconButton size="large" onClick={handleKeyboardClick}>
              <KeyboardIcon sx={{ fontSize: '5em' }} color='primary' />
            </IconButton>
          }
        </Grid>
        <Grid item xs={4} display={'flex'} justifyContent={'right'} alignItems={'center'}>
          <Box sx={{ visibility: page === lengthValue ? 'hidden' : 'visible', }}>
            <IconButton size="large" onClick={handleNextPageClick} sx={{ margin: 'auto' }}>
              <ArrowForwardIosIcon color="primary" sx={{ fontSize: '3.5em' }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
