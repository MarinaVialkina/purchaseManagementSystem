import React, { useState, useEffect } from "react";
import { Layout } from '@consta/uikit/Layout';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Table } from '@consta/uikit/Table';
import { Tag } from '@consta/uikit/Tag';

import { getCustomers, createCustomer, deleteCustomer, updateCustomer, getCustomerSimpleList } from "./api";

function Customers() {
  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    minWidth: '200px'
  };

  const checkboxStyle = {
    marginRight: '8px',
    cursor: 'pointer'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: '15px'
  };

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customersSimple, setCustomersSimple] = useState([]);
  const [loadingCustomersSimple, setLoadingCustomersSimple] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    customerCode: "",
    customerName: "",
    customerInn: "",
    customerKpp: "",
    customerLegalAddress: "",
    customerPostalAddress: "",
    customerEmail: "",
    customerCodeMain: "",
    isOrganization: false,
    isPerson: false
  });

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [filter, setFilter] = useState({
    customerCode: "",
    customerName: "",
    customerInn: "",
    customerKpp: "",
    customerLegalAddress: "",
    customerPostalAddress: "",
    customerEmail: "",
    customerCodeMain: "",
    isOrganization: null,
    isPerson: null
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'customerName',
    direction: 'asc'
  });

  useEffect(() => {
    loadCustomers();
    loadCustomersSimple();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const cleanFilter = {};

      if (filter.customerCode) cleanFilter.customerCode = filter.customerCode;
      if (filter.customerName) cleanFilter.customerName = filter.customerName;
      if (filter.customerInn) cleanFilter.customerInn = filter.customerInn;
      if (filter.customerKpp) cleanFilter.customerKpp = filter.customerKpp;
      if (filter.customerLegalAddress) cleanFilter.customerLegalAddress = filter.customerLegalAddress;
      if (filter.customerPostalAddress) cleanFilter.customerPostalAddress = filter.customerPostalAddress;
      if (filter.customerEmail) cleanFilter.customerEmail = filter.customerEmail;
      if (filter.customerCodeMain) cleanFilter.customerCodeMain = filter.customerCodeMain;

      if (filter.isOrganization !== undefined && filter.isOrganization !== false) {
        cleanFilter.organization = filter.isOrganization;
      }
      if (filter.isPerson !== undefined && filter.isPerson !== false) {
        cleanFilter.person = filter.isPerson;
      }

      const data = await getCustomers(cleanFilter);
      setCustomers(data.content || data);
    } catch (error) {
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomersSimple = async () => {
    setLoadingCustomersSimple(true);
    try {
      const data = await getCustomerSimpleList();
      setCustomersSimple(data);
    } catch (error) {
      alert(`Ошибка загрузки списка контрагентов: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoadingCustomersSimple(false);
    }
  };

  const handleCreate = async () => {
    if (!newCustomer.customerCode || newCustomer.customerCode.trim() === '') {
      alert('Поле "Код контрагента" обязательно для заполнения');
      return;
    }

    if (!newCustomer.customerName || newCustomer.customerName.trim() === '') {
      alert('Поле "Наименование" обязательно для заполнения');
      return;
    }

    if (newCustomer.isOrganization && newCustomer.isPerson) {
      alert('Контрагент не может быть одновременно юридическим и физическим лицом');
      return;
    }

    try {
      await createCustomer(newCustomer);
      alert('Контрагент успешно создан');
      setNewCustomer({
        customerCode: "",
        customerName: "",
        customerInn: "",
        customerKpp: "",
        customerLegalAddress: "",
        customerPostalAddress: "",
        customerEmail: "",
        customerCodeMain: "",
        isOrganization: false,
        isPerson: false
      });
      loadCustomers();
      loadCustomersSimple();
    } catch (error) {
      const errorMessage = error.message ||
        (error.errors ? JSON.stringify(error.errors) :
          (error.error || 'Неизвестная ошибка'));
      alert(`Ошибка создания контрагента:\n${errorMessage}`);
    }
  };

  const handleDelete = async (code) => {
    if (window.confirm('Вы уверены, что хотите удалить контрагента?')) {
      try {
        await deleteCustomer(code);
        alert('Контрагент успешно удалён');
        loadCustomers();
        loadCustomersSimple();
      } catch (error) {
        const errorMessage = error.message ||
          (error.errors ? JSON.stringify(error.errors) :
            (error.error || 'Неизвестная ошибка'));
        alert(`Ошибка удаления контрагента: ${errorMessage}`);
      }
    }
  };

  const startEdit = (customer) => {
    setEditingCustomer({
      ...customer,
      customerCodeMain: customer.customerCodeMain || ""
    });
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
  };

  const handleUpdate = async () => {
    if (!editingCustomer) return;

    if (!editingCustomer.customerName || editingCustomer.customerName.trim() === '') {
      alert('Поле "Наименование" обязательно для заполнения');
      return;
    }

    if (editingCustomer.isOrganization && editingCustomer.isPerson) {
      alert('Контрагент не может быть одновременно юридическим и физическим лицом');
      return;
    }

    try {
      console.log('Отправка данных обновления:', editingCustomer);
      await updateCustomer(editingCustomer.customerCode, editingCustomer);
      alert('Контрагент успешно обновлён');
      setEditingCustomer(null);
      loadCustomers();
      loadCustomersSimple();
    } catch (error) {
      const errorMessage = error.message ||
        (error.errors ? JSON.stringify(error.errors) :
          (error.error || 'Неизвестная ошибка'));
      alert(`Ошибка обновления контрагента:\n${errorMessage}`);
    }
  };

  const resetFilterHandler = async () => {
    const resetFilter = {
      customerCode: "",
      customerName: "",
      customerInn: "",
      customerKpp: "",
      customerLegalAddress: "",
      customerPostalAddress: "",
      customerEmail: "",
      customerCodeMain: "",
      isOrganization: null,
      isPerson: null
    };

    setFilter(resetFilter);
    try {
      setLoading(true);
      const data = await getCustomers({});
      setCustomers(data.content || data);
    } catch (error) {
      alert(`Ошибка загрузки данных: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const sortCustomers = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
      const aValue = a[key] || '';
      const bValue = b[key] || '';

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setCustomers(sortedCustomers);
  };

  const customerSimpleItems = customersSimple.map(customer => ({
    label: `${customer.customerName} (${customer.customerCode})`,
    value: customer.customerCode
  }));


  return (
    <Layout direction="column" gap="m">
      <h1>Контрагенты</h1>

      <Card verticalSpace="m" horizontalSpace="m" form="round" shadow={false} border>
        <h3>Добавить контрагента</h3>
        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Код контрагента *"
            value={newCustomer.customerCode}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerCode: e.target.value
            }))}
            style={inputStyle}
            required
          />
          <input
            placeholder="Наименование *"
            value={newCustomer.customerName}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerName: e.target.value
            }))}
            style={inputStyle}
            required
          />
          <input
            placeholder="ИНН (10 или 12 цифр)"
            value={newCustomer.customerInn}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerInn: e.target.value
            }))}
            style={inputStyle}
          />
        </Layout>
        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="КПП (9 цифр)"
            value={newCustomer.customerKpp}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerKpp: e.target.value
            }))}
            style={inputStyle}
          />
          <input
            placeholder="Юр. адрес"
            value={newCustomer.customerLegalAddress}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerLegalAddress: e.target.value
            }))}
            style={inputStyle}
          />
          <input
            placeholder="Почтовый адрес"
            value={newCustomer.customerPostalAddress}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerPostalAddress: e.target.value
            }))}
            style={inputStyle}
          />
        </Layout>

        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Электронная почта"
            value={newCustomer.customerEmail}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerEmail: e.target.value
            }))}
            style={inputStyle}
          />
          <select
            value={newCustomer.customerCodeMain || ""}
            onChange={(e) => setNewCustomer(prev => ({
              ...prev,
              customerCodeMain: e.target.value
            }))}
            style={selectStyle}
            disabled={loadingCustomersSimple}
          >
            <option value="">Вышестоящий контрагент</option>
            {customersSimple.map(customer => (
              <option key={customer.customerCode} value={customer.customerCode}>
                {customer.customerName} ({customer.customerCode})
              </option>
            ))}
          </select>
          {loadingCustomersSimple && <span style={{ marginLeft: "10px" }}>Загрузка...</span>}
        </Layout>

        <Layout direction="row" gap="m" align="center" style={{ marginBottom: '10px' }}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={newCustomer.isOrganization}
              onChange={(e) => setNewCustomer(prev => ({
                ...prev,
                isOrganization: e.target.checked,
                isPerson: e.target.checked ? false : prev.isPerson
              }))}
              style={checkboxStyle}
            />
            <span>Юр. лицо</span>
          </label>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={newCustomer.isPerson}
              onChange={(e) => setNewCustomer(prev => ({
                ...prev,
                isPerson: e.target.checked,
                isOrganization: e.target.checked ? false : prev.isOrganization
              }))}
              style={checkboxStyle}
            />
            <span>Физ. лицо</span>
          </label>
        </Layout>

        <Button
          label="Добавить"
          onClick={handleCreate}
          size="m"
          style={{ width: "200px" }}
        />
      </Card>


      {editingCustomer && (
        <Modal isOpen={!!editingCustomer} onClickOutside={cancelEdit} onEsc={cancelEdit}>
          <Card verticalSpace="m" horizontalSpace="m" form="round">

            <h3>Редактировать контрагента: {editingCustomer.customerCode}</h3>
            <Layout direction="column" gap="m">
              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Код контрагента</div>
                <input
                  placeholder="Код контрагента"
                  value={editingCustomer.customerCode}
                  disabled
                  style={{ ...inputStyle, backgroundColor: '#f5f5f5' }}
                />
              </div>

              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Наименование *</div>
                <input
                  placeholder="Наименование"
                  value={editingCustomer.customerName}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev, customerName: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>ИНН (10 или 12 цифр)</div>
                <input
                  placeholder="ИНН"
                  value={editingCustomer.customerInn || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev, customerInn: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>КПП (9 цифр)</div>
                <input
                  placeholder="КПП"
                  value={editingCustomer.customerKpp || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev, customerKpp: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Юр. адрес</div>
                <input
                  placeholder="Юр. адрес"
                  value={editingCustomer.customerLegalAddress || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev, customerLegalAddress: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Почтовый адрес</div>
                <input
                  placeholder="Почтовый адрес"
                  value={editingCustomer.customerPostalAddress || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev, customerPostalAddress: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Электронная почта</div>
                <input
                  placeholder="Электронная почта"
                  value={editingCustomer.customerEmail || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev, customerEmail: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Вышестоящий контрагент</div>
                <select
                  value={editingCustomer.customerCodeMain || ""}
                  onChange={(e) => setEditingCustomer(prev => ({
                    ...prev,
                    customerCodeMain: e.target.value
                  }))}
                  style={selectStyle}
                  disabled={loadingCustomersSimple}
                >
                  <option value="">Вышестоящий контрагент</option>
                  {customersSimple.map(customer => (
                    <option key={customer.customerCode} value={customer.customerCode}>
                      {customer.customerName} ({customer.customerCode})
                    </option>
                  ))}
                </select>
              </div>

              <Layout direction="row" gap="m" align="center">
                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    checked={editingCustomer.isOrganization}
                    onChange={(e) => setEditingCustomer(prev => ({
                      ...prev,
                      isOrganization: e.target.checked,
                      isPerson: e.target.checked ? false : prev.isPerson
                    }))}
                    style={checkboxStyle}
                  />
                  <span>Юр. лицо</span>
                </label>

                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    checked={editingCustomer.isPerson}
                    onChange={(e) => setEditingCustomer(prev => ({
                      ...prev,
                      isPerson: e.target.checked,
                      isOrganization: e.target.checked ? false : prev.isOrganization
                    }))}
                    style={checkboxStyle}
                  />
                  <span>Физ. лицо</span>
                </label>
              </Layout>

              <Layout direction="row" gap="m">
                <Button label="Сохранить" onClick={handleUpdate} size="s" />
                <Button label="Отмена" onClick={cancelEdit} size="s" view="secondary" />
              </Layout>

            </Layout>
          </Card>
        </Modal>
      )}



      <Card verticalSpace="m" horizontalSpace="m" form="round" shadow={false} border>

        <h3>Фильтры</h3>
        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Фильтр по названию"
            value={filter.customerName}
            onChange={(e) => setFilter(prev => ({ ...prev, customerName: e.target.value }))}
            style={inputStyle}
          />
          <input
            placeholder="Фильтр по ИНН"
            value={filter.customerInn}
            onChange={(e) => setFilter(prev => ({ ...prev, customerInn: e.target.value }))}
            style={inputStyle}
          />
          <input
            placeholder="Фильтр по КПП"
            value={filter.customerKpp}
            onChange={(e) => setFilter(prev => ({ ...prev, customerKpp: e.target.value }))}
            style={inputStyle}
          />
        </Layout>

        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Фильтр по юр. адресу"
            value={filter.customerLegalAddress}
            onChange={(e) => setFilter(prev => ({ ...prev, customerLegalAddress: e.target.value }))}
            style={inputStyle}
          />
          <input
            placeholder="Фильтр по почтовому адресу"
            value={filter.customerPostalAddress}
            onChange={(e) => setFilter(prev => ({ ...prev, customerPostalAddress: e.target.value }))}
            style={inputStyle}
          />
          <select
            value={filter.customerCodeMain || ""}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              customerCodeMain: e.target.value
            }))}
            style={selectStyle}
            disabled={loadingCustomersSimple}
          >
            <option value="">Фильтр по вышестоящему контрагенту</option>
            {customersSimple.map(customer => (
              <option key={customer.customerCode} value={customer.customerCode}>
                {customer.customerName} ({customer.customerCode})
              </option>
            ))}
          </select>
        </Layout>

        <Layout direction="row" gap="m" align="center" style={{ marginBottom: '10px' }}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={filter.isOrganization === true}
              onChange={(e) => {
                const checked = e.target.checked;
                setFilter(prev => ({
                  ...prev,
                  isOrganization: checked,
                  isPerson: checked ? false : prev.isPerson
                }));
              }}
              style={checkboxStyle}
            />
            <span>Юр. лицо</span>
          </label>

          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={filter.isPerson === true}
              onChange={(e) => {
                const checked = e.target.checked;
                setFilter(prev => ({
                  ...prev,
                  isPerson: checked,
                  isOrganization: checked ? false : prev.isOrganization
                }));
              }}
              style={checkboxStyle}
            />
            <span>Физ. лицо</span>
          </label>
        </Layout>

        <Layout direction="row" gap="m">
          <Button label="Применить фильтры" onClick={loadCustomers} size="s" />
          <Button label="Сбросить фильтры" onClick={resetFilterHandler} size="s" view="secondary" />
        </Layout>

      </Card>



      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <Table
          rows={customers}
          columns={[
            {
              title: 'Код',
              accessor: 'customerCode',
              width: 100,
            },
            {
              title: (
                <div style={{ cursor: 'pointer' }} onClick={() => sortCustomers('customerName')}>
                  Наименование
                  {sortConfig.key === 'customerName' && (
                    <span style={{ marginLeft: 4 }}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              ),
              accessor: 'customerName',
            },
            {
              title: 'ИНН',
              accessor: 'customerInn',
              renderCell: (row) => row.customerInn || '-',
            },
            {
              title: 'КПП',
              accessor: 'customerKpp',
              renderCell: (row) => row.customerKpp || '-',
            },
            {
              title: 'Юр. адрес',
              accessor: 'customerLegalAddress',
              renderCell: (row) => row.customerLegalAddress || '-',
            },
            {
              title: 'Почтовый адрес',
              accessor: 'customerPostalAddress',
              renderCell: (row) => row.customerPostalAddress || '-',
            },
            {
              title: 'Электронная почта',
              accessor: 'customerEmail',
              renderCell: (row) => row.customerEmail || '-',
            },
            {
              title: 'Вышестоящий контрагент',
              accessor: 'customerCodeMain',
              renderCell: (row) => {
                if (!row.customerCodeMain) return '-';
                const parent = customersSimple.find(c => c.customerCode === row.customerCodeMain);
                return parent ? `${parent.customerName} (${parent.customerCode})` : row.customerCodeMain;
              },
            },
            {
              title: 'Юр. лицо/Физ.лицо',
              accessor: 'type',
              renderCell: (row) => row.isOrganization ?
                <Tag label="Юр. лицо" mode="info" size="m" style={{ width: "100px" }} /> :
                row.isPerson ?
                  <Tag label="Физ. лицо" mode="success" size="m" style={{ width: "100px" }} /> :
                  '-',
            },
            {
              title: 'Действия',
              accessor: 'actions',
              renderCell: (row) => (
                <Layout direction="column" gap="xs">
                  <Button
                    label="Редактировать"
                    onClick={() => startEdit(row)}
                    size="s"
                  />
                  <Button
                    label="Удалить"
                    onClick={() => handleDelete(row.customerCode)}
                    size="s"
                    view="warning"
                  />
                </Layout>
              ),
            },
          ]}
          getRowId={(row) => row.customerCode || row.id}
          size="s"
          zebraStriped="odd"
          emptyRowsPlaceholder={<div style={{ textAlign: 'center', padding: '20px' }}>Нет данных</div>}
        />
      )}
    </Layout>
  );
}

export default Customers;