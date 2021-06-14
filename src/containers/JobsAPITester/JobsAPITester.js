import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormGroup from 'react-bootstrap/FormGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';
import sortObject from '../../helpers/sortObject';

const domain = {
  'australia': 'https://applynow.net.au/api/v2/jobs?current=true&recursive=true',
  'canada': 'https://scouterecruit.net/api/v2/jobs?current=true&recursive=true'
}

const JobsAPITester = props => {
  const [apiKey, setApiKey] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('australia');
  const [apiEndPoint, setApiEndPoint] = useState(domain[selectedCountry]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  const validateClickHandler = () => {
    setLoading(true);
    setDirty(true);
    axios.get(apiEndPoint, {
      'headers': {
        'Content-Type': 'application/json',
        'X-api-authenticate': apiKey
      }
    }).then((result) => {
      setLoading(false);
      setError(result.data.jobs.length > 0 ? '' : 'There are no published jobs in the account.');
      setJobs(sortObject(result.data.jobs, 'title', 'asc'));
    }).catch((error) => {
      setLoading(false);
      setError(error.response.data);
      setJobs([]);
      return Promise.reject(error);
    });
  }

  const apiEndPointHandler = (country) => {
    setSelectedCountry(country);
    setApiEndPoint(domain[country]);
    setJobs([]);
    setError('');
    setDirty(false);
  }

  const joblist = jobs.map((job) => {
    return <li key={job.reference}>
      <a href={job.public_url} target="_blank" rel="noreferrer noopener">{job.title}</a> {job.reference}
      <br />Entity: {job.entity}
      <br />Status: {job.state}
    </li>;
  });

  const changeEndPoint = (e) => {
    setApiEndPoint(e.target.value);
  }

  return (
    <>
      <label htmlFor="">API End Point</label>
      <FormGroup>
        <InputGroup>
          <DropdownButton
            as={InputGroup.Prepend}
            variant="outline-secondary"
            title={selectedCountry}
          >
            <Dropdown.Item href="#" onClick={() => apiEndPointHandler("australia") }>Australia</Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => apiEndPointHandler("canada") }>Canada</Dropdown.Item>
          </DropdownButton>
          <FormControl aria-describedby="" value={apiEndPoint} onChange={(e) => changeEndPoint(e)} />
        </InputGroup>
        <small className="form-text text-muted">
          See API documentation here: <a href="https://scoutv2.docs.apiary.io/#reference/jobs/job-collection/list-jobs" target="_blank">https://scoutv2.docs.apiary.io/</a>
        </small>
      </FormGroup>
  
      <label htmlFor="">API Key</label>
      <InputGroup className="mb-3">
        <FormControl aria-describedby="" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setJobs([]); setError(''); setDirty(false); }} />
        <InputGroup.Append>
          <Button variant="primary" className={apiKey === '' || loading ? 'disabled' : ''} onClick={() => validateClickHandler()}>Validate</Button>
        </InputGroup.Append>
      </InputGroup>

      {loading ? 'Validating...' : null}
      {dirty && !loading ? jobs.length + ' Jobs' : ''}
      <ul>
        {!loading ? joblist : null}
      </ul>
      {error !== "" ?
        <Alert variant="danger">
          {error}
        </Alert>
        : null}
    </>
  )
}

export default JobsAPITester;
