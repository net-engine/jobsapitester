import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';
import sortObject from '../../helpers/sortObject';

const JobsAPITester = props => {
  const [apiKey, setApiKey] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('australia');
  const [domain, setDomain] = useState({
    'australia': 'https://applynow.net.au/api/v2/jobs',
    'canada': 'https://scouterecruit.net/api/v2/jobs'
  });
  const [params, setParams] = useState('');
  const [apiEndPoint, setApiEndPoint] = useState(domain[selectedCountry] + params);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  const validateClickHandler = () => {
    setLoading(true);
    setDirty(true);
    axios.get(domain[selectedCountry], {
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
    setApiEndPoint(domain[country] + params);
  }

  const joblist = jobs.map((job) => {
    return <li key={job.reference}><a href={job.public_url} target="_blank" rel="noreferrer noopener">{job.title}</a> {job.reference}</li>
  });

  const changeEndPoint = (e) => {
    setApiEndPoint(e.target.value);
  }

  return (
    <>
      <label htmlFor="">API End Point</label>
      <InputGroup className="mb-3">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          title={selectedCountry}
        >
          <Dropdown.Item href="#" onClick={() => { apiEndPointHandler("australia"); setApiKey(''); setJobs([]); setError('') }}>Australia</Dropdown.Item>
          <Dropdown.Item href="#" onClick={() => { apiEndPointHandler("canada"); setApiKey(''); setJobs([]); setError('') }}>Canada</Dropdown.Item>
        </DropdownButton>
        <FormControl aria-describedby="" value={apiEndPoint} onChange={(e) => changeEndPoint(e)} />
      </InputGroup>

      <label htmlFor="">API Key</label>
      <InputGroup className="mb-3">
        <FormControl aria-describedby="" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setJobs([]); setError(''); }} />
        <InputGroup.Append>
          <Button variant="primary" className={loading ? 'disabled' : ''} onClick={() => validateClickHandler()}>Validate</Button>
        </InputGroup.Append>
      </InputGroup>

      {dirty && !loading ? jobs.length + ' Jobs' : ''}
      <ul>
        {joblist}
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
