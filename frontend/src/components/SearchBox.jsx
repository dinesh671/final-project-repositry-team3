import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import search from '../assets/search.svg';
import { FiSearch } from 'react-icons/fi';
import { IoSearchSharp} from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');
  const [display, setDisplay] = useState(false);
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      // navigate('/');
    }
  };

  return (
    <Form
      onSubmit={submitHandler}
      className='d-flex gap-2 p-2  justify-space-between'
    >
      {display && (
        <Form.Control
          type='text'
          name='q'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder='Search Products...'
          className={`mr-sm-2 ml-sm-5 rounded-pill search-input`}
        ></Form.Control>
      )}
      <Button
        onClick={() => setDisplay(!display)}
        type='submit'
        variant='light'
        className='d-flex align-items-center justify-content-center rounded-circle search-btn p-0'
      >
          <IoSearchSharp className=' w-20 d-flex align-items-center justify-content-center rounded-circle' />
      </Button>
      {/* <IoSearchSharp/> */}
    </Form>
  );
};

export default SearchBox;
