import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col, Image, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import ConfirmationModal from '../../components/ConfirmationModal';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = (id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteHandler = async () => {
    try {
      await deleteProduct(selectedProductId);
      setShowDeleteModal(false);
      setSelectedProductId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    setShowCreateModal(true);
  };

  const confirmCreateHandler = async () => {
    try {
      await createProduct();
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const columns = [
    {
      dataField: '_id',
      text: 'ID',
      sort: true,
    },
    {
      dataField: 'image',
      text: 'Image',
      formatter: (cell, row) => <Image src={cell} alt={row.name} width={50} />,
    },
    {
      dataField: 'name',
      text: '',
      filter: textFilter({
        placeholder: 'Product Name',
        getFilter: (filter) => filter,
        filterRenderer: (onFilter, column) => (
          <Form>
            <Form.Control
              as='input'
              type='text'
              variant='flush'
              className='filter'
              placeholder={column.text}
              onChange={(e) => onFilter(e.target.value)}
            ></Form.Control>
          </Form>
        ),
      }),
      sort: true,
    },
    {
      dataField: 'price',
      text: 'Price',
      sort: true,
    },
    {
      dataField: 'category',
      text: '',
      filter: textFilter({
        placeholder: 'Category',
        getFilter: (filter) => filter,
        filterRenderer: (onFilter, column) => (
          <div>
            <input
              type='text'
              className='form-control'
              placeholder={column.text}
              onChange={(e) => onFilter(e.target.value)}
            />
          </div>
        ),
      }),
      sort: true,
    },
    {
      dataField: 'brand',
      text: 'Brand',
      sort: true,
    },
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: (cell, row) => (
        <div>
          <LinkContainer to={`/admin/product/${row._id}/edit`}>
            <Button variant='light' className='btn-sm mx-2'>
              <FaEdit />
            </Button>
          </LinkContainer>
          <Button
            variant='danger'
            className='btn-sm'
            onClick={() => deleteHandler(row._id)}
          >
            <FaTrash style={{ color: 'white' }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <BootstrapTable
            keyField='_id'
            data={data.products}
            columns={columns}
            filter={filterFactory()}
            striped
            hover
            responsive
            bordered={false}
          />
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteHandler}
        message='Are you sure you want to delete this product?'
      />

      {/* Create Confirmation Modal */}
      <ConfirmationModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={confirmCreateHandler}
        message='Are you sure you want to create a new product?'
      />
    </>
  );
};

export default ProductListScreen;
