import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classes from './TableMenu.module.css';
import { CSVLink } from 'react-csv';
import { formatFileDateUS } from '../../utils/constants';
import { printComponent } from '../../utils/global.services';
import { tableStyles } from '../../utils/printStyles/printStyles';
import { chartPrintStyle } from '../../utils/printStyles/chartPrintStyle';

export const TableMenu = ({
  csvData,
  csvAllData,
  csvHeaders = null,
  filename,
  printId,
  printScale,
  printStyles,
  className = '',
  printChart
}) => {
  const menuRef = useRef(null);
  const defaultStyles = useMemo(() => {
    if (printStyles) return printStyles;
    return printChart ? chartPrintStyle : tableStyles;
  }, [printStyles, printChart]);
  const [isOpen, setOpen] = useState(false);
  const defaultFilename = useMemo(
    () => `file ${formatFileDateUS(new Date())}`,
    []
  );

  const onClick = () => {
    setOpen(!isOpen);
  };

  const checkMenu = useCallback(
    (e) => {
      if (!isOpen || !menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    },
    [isOpen, setOpen, menuRef]
  );

  //Control closing Select results
  useEffect(() => {
    window.addEventListener('click', checkMenu);
    return () => {
      window.removeEventListener('click', checkMenu);
    };
  }, [checkMenu]);

  return (
    <div ref={menuRef} className={`${classes.tableMenuBox} ${className}`}>
      <div
        className={`${classes.tableMenuIcon} ${
          isOpen ? classes.tabMenuActive : ''
        }`}
        onClick={onClick}
      >
        <span className={classes.tableMenuPoint}></span>
        <span className={classes.tableMenuPoint}></span>
        <span className={classes.tableMenuPoint}></span>
      </div>
      <div
        className={`${classes.tableMenuList} ${
          isOpen ? classes.tableMenuListOpen : ''
        }`}
      >
        <ul className={classes.tableMenuListBox}>
          {csvData ? (
            <li className={classes.tableMenuOption}>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={`${filename ? filename : defaultFilename}.csv`}
                className={classes.tableMenuOptionLink}
              >
                Export CSV
              </CSVLink>
            </li>
          ) : null}
          {csvAllData ? (
            <li className={classes.tableMenuOption}>
              <CSVLink
                data={csvAllData}
                headers={csvHeaders}
                filename={`${filename ? filename : defaultFilename}.csv`}
                className={classes.tableMenuOptionLink}
              >
                Export all CSV
              </CSVLink>
            </li>
          ) : null}
          {printId ? (
            <li
              className={classes.tableMenuOption}
              onClick={() =>
                printComponent({
                  id: printId,
                  styles: defaultStyles,
                  scale: printScale
                })
              }
            >
              Print
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};
