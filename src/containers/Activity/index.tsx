import React from 'react';
import ErrorAlert from "../../components/ErrorAlert";
import { Activity as ActivityType } from '../../types';

type Props = {
  active: boolean;
  activity: ActivityType|null;
  error: any;
}

const Activity: React.FunctionComponent<Props> = ({ active, activity, error, children }) => {
  return (
    <>
      <ErrorAlert error={error} />
      {
        active && activity !== null && children
      }
      {
        !active && (
          <div className="py-5 text-center">Please connect your wallet first.</div>
        )
      }
      {
        active && activity === null && (
          <div className="py-5 text-center">Please select an activity.</div>
        )
      }
    </>
  )
}

export default Activity