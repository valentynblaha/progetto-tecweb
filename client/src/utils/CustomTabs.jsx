import React from 'react'
import { Tab, Tabs, styled } from "@mui/material";

export const CustomTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

export const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#1976d2',
    borderWidth: "0.2em",
    borderColor: "#1976d2",
    borderStyle: "solid",
    margin: "0.5em",
    borderRadius: "10000px",
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: "#1976d2"
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);