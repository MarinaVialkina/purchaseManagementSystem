import React, { useState, useEffect } from "react";
import { Layout } from '@consta/uikit/Layout';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Table } from '@consta/uikit/Table';
import { Tag } from '@consta/uikit/Tag';

import { getLots, createLot, deleteLot, updateLot, getCustomerSimpleList } from "./api";

function Lots() {
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

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customersSimple, setCustomersSimple] = useState([]);
  const [loadingCustomersSimple, setLoadingCustomersSimple] = useState(false);

  const [newLot, setNewLot] = useState({
    lotName: "",
    customerCode: "",
    price: "",
    currencyCode: "RUB",
    ndsRate: "Без НДС",
    placeDelivery: "",
    dateDelivery: ""
  });

  const [editingLot, setEditingLot] = useState(null);

  const [filter, setFilter] = useState({
    lotName: "",
    customerCode: "",
    minPrice: "",
    maxPrice: "",
    currencyCode: "",
    ndsRate: "",
    placeDelivery: "",
    dateDeliveryFrom: "",
    dateDeliveryTo: ""
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'lotName',
    direction: 'asc'
  });

  const currencyOptions = ["RUB", "USD", "EUR"];
  const ndsOptions = ["Без НДС", "18%", "20%"];

  useEffect(() => {
    loadLots();
    loadCustomersSimple();
  }, []);

  const loadLots = async () => {
    setLoading(true);
    try {
      const cleanFilter = {};

      if (filter.lotName) cleanFilter.lotName = filter.lotName;
      if (filter.customerCode) cleanFilter.customerCode = filter.customerCode;
      if (filter.minPrice) cleanFilter.minPrice = filter.minPrice;
      if (filter.maxPrice) cleanFilter.maxPrice = filter.maxPrice;
      if (filter.currencyCode) cleanFilter.currencyCode = filter.currencyCode;
      if (filter.ndsRate) cleanFilter.ndsRate = filter.ndsRate;
      if (filter.placeDelivery) cleanFilter.placeDelivery = filter.placeDelivery;
      if (filter.dateDeliveryTo) cleanFilter.dateDeliveryTo = filter.dateDeliveryTo;
      if (filter.dateDeliveryFrom) cleanFilter.dateDeliveryFrom = filter.dateDeliveryFrom;



      const data = await getLots(cleanFilter);
      setLots(data.content || data);
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
    try {
      await createLot(newLot);
      alert('Лот успешно создан');
      setNewLot({
        lotName: "",
        customerCode: "",
        price: "",
        currencyCode: "RUB",
        ndsRate: "Без НДС",
        placeDelivery: "",
        dateDelivery: ""
      });
      loadLots();
    } catch (error) {
      const errorMessage = error.message ||
        (error.errors ? JSON.stringify(error.errors) :
          (error.error || 'Неизвестная ошибка'));
      alert(`Ошибка создания лота:\n${errorMessage}`);
    }
  };

  const handleDelete = async (lotName) => {
    if (window.confirm('Вы уверены, что хотите удалить лот?')) {
      try {
        await deleteLot(lotName);
        alert('Лот успешно удалён');
        loadLots();
      } catch (error) {
        const errorMessage = error.message ||
          (error.errors ? JSON.stringify(error.errors) :
            (error.error || 'Неизвестная ошибка'));
        alert(`Ошибка удаления лота: ${errorMessage}`);
      }
    }
  };

  const startEdit = (lot) => {
    let formattedDate = "";
    if (lot.dateDelivery) {
      try {
        const date = new Date(lot.dateDelivery);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().slice(0, 16);
        }
      } catch (e) {
        console.error("Ошибка форматирования даты:", e);
      }
    }

    setEditingLot({
      ...lot,
      dateDelivery: formattedDate,
      price: lot.price ? lot.price.toString() : "0"
    });
  };

  const cancelEdit = () => {
    setEditingLot(null);
  };

  const handleUpdate = async () => {
    if (!editingLot) return;

    try {
      await updateLot(editingLot.lotName, editingLot);
      alert('Лот успешно обновлён');
      setEditingLot(null);
      loadLots();
    } catch (error) {
      const errorMessage = error.message ||
        (error.errors ? JSON.stringify(error.errors) :
          (error.error || 'Неизвестная ошибка'));
      alert(`Ошибка обновления лота:\n${errorMessage}`);
    }
  };

  const resetFilterHandler = async () => {
    const resetFilter = {
      lotName: "",
      customerCode: "",
      minPrice: "",
      maxPrice: "",
      currencyCode: "",
      ndsRate: "",
      placeDelivery: "",
      dateDeliveryFrom: "",
      dateDeliveryTo: ""
    };

    setFilter(resetFilter);
    try {
      setLoading(true);
      const data = await getLots({});
      setLots(data.content || data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert(`Ошибка загрузки данных: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const sortLots = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedLots = [...lots].sort((a, b) => {
      const aValue = a[key] || '';
      const bValue = b[key] || '';


      if (key === 'price') {
        const aNum = parseFloat(aValue) || 0;
        const bNum = parseFloat(bValue) || 0;
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      if (key === 'dateDelivery') {
        const aDate = aValue ? new Date(aValue).getTime() : 0;
        const bDate = bValue ? new Date(bValue).getTime() : 0;
        return direction === 'asc' ? aDate - bDate : bDate - aDate;
      }


      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setLots(sortedLots);
  };


  const customerItems = customersSimple.map(customer => ({
    label: `${customer.customerName} (${customer.customerCode})`,
    value: customer.customerCode
  }));

  return (
    <Layout direction="column" gap="m">
      <h1>Лоты</h1>

      <Card verticalSpace="m" horizontalSpace="m" form="round" shadow={false} border>

        <h3>Добавить лот</h3>
        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Наименование *"
            value={newLot.lotName}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              lotName: e.target.value
            }))}
            style={inputStyle}
            required
          />
          <select
            value={newLot.customerCode}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              customerCode: e.target.value
            }))}
            style={selectStyle}
            disabled={loadingCustomersSimple}
            required
          >
            <option value="">Выберите контрагента *</option>
            {customersSimple.map(customer => (
              <option key={customer.customerCode} value={customer.customerCode}>
                {customer.customerName} ({customer.customerCode})
              </option>
            ))}
          </select>
        </Layout>

        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Начальная стоимость"
            type="number"
            min="0"
            step="0.01"
            value={newLot.price}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              price: e.target.value
            }))}
            style={inputStyle}
          />

          <select
            value={newLot.currencyCode}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              currencyCode: e.target.value
            }))}
            style={selectStyle}
          >
            {currencyOptions.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <select
            value={newLot.ndsRate}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              ndsRate: e.target.value
            }))}
            style={selectStyle}
          >
            {ndsOptions.map(nds => (
              <option key={nds} value={nds}>
                {nds}
              </option>
            ))}
          </select>
        </Layout>

        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Грузополучатель"
            value={newLot.placeDelivery}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              placeDelivery: e.target.value
            }))}
            style={inputStyle}
          />

          <input
            type="datetime-local"
            value={newLot.dateDelivery}
            onChange={(e) => setNewLot(prev => ({
              ...prev,
              dateDelivery: e.target.value
            }))}
            style={inputStyle}
          />
        </Layout>

        <Button
          label="Добавить"
          onClick={handleCreate}
          size="m"
          style={{ width: "200px" }}
        />
      </Card>



      {editingLot && (
        <Modal isOpen={!!editingLot} onClickOutside={cancelEdit} onEsc={cancelEdit}>
          <Card verticalSpace="m" horizontalSpace="m" form="round">

            <h3>Редактировать лот: {editingLot.lotName}</h3>
            <Layout direction="column" gap="m">
              <div>
                <div style={labelStyle}>Наименование *</div>
                <input
                  placeholder="Наименование"
                  value={editingLot.lotName}
                  disabled
                  style={{ ...inputStyle, backgroundColor: '#f5f5f5' }}
                />
              </div>

              <div>
                <div style={labelStyle}>Контрагент *</div>
                <select
                  value={editingLot.customerCode}
                  onChange={(e) => setEditingLot(prev => ({
                    ...prev,
                    customerCode: e.target.value
                  }))}
                  style={selectStyle}
                  disabled={loadingCustomersSimple}
                  required
                >
                  <option value="">Выберите контрагента</option>
                  {customersSimple.map(customer => (
                    <option key={customer.customerCode} value={customer.customerCode}>
                      {customer.customerName} ({customer.customerCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={labelStyle}>Начальная стоимость</div>
                <input
                  placeholder="Начальная стоимость"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingLot.price}
                  onChange={(e) => setEditingLot(prev => ({
                    ...prev,
                    price: e.target.value
                  }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={labelStyle}>Валюта</div>
                <select
                  value={editingLot.currencyCode}
                  onChange={(e) => setEditingLot(prev => ({
                    ...prev,
                    currencyCode: e.target.value
                  }))}
                  style={selectStyle}
                >
                  {currencyOptions.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={labelStyle}>Код НДС</div>
                <select
                  value={editingLot.ndsRate}
                  onChange={(e) => setEditingLot(prev => ({
                    ...prev,
                    ndsRate: e.target.value
                  }))}
                  style={selectStyle}
                >
                  {ndsOptions.map(nds => (
                    <option key={nds} value={nds}>
                      {nds}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={labelStyle}>Грузополучатель</div>
                <input
                  placeholder="Грузополучатель"
                  value={editingLot.placeDelivery || ''}
                  onChange={(e) => setEditingLot(prev => ({
                    ...prev,
                    placeDelivery: e.target.value
                  }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={labelStyle}>Дата доставки</div>
                <input
                  type="datetime-local"
                  value={editingLot.dateDelivery}
                  onChange={(e) => setEditingLot(prev => ({
                    ...prev,
                    dateDelivery: e.target.value
                  }))}
                  style={inputStyle}
                />
              </div>

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
            value={filter.lotName}
            onChange={(e) => setFilter(prev => ({ ...prev, lotName: e.target.value }))}
            style={inputStyle}
          />

          <select
            value={filter.customerCode || ""}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              customerCode: e.target.value
            }))}
            style={selectStyle}
            disabled={loadingCustomersSimple}
          >
            <option value="">Все контрагенты</option>
            {customersSimple.map(customer => (
              <option key={customer.customerCode} value={customer.customerCode}>
                {customer.customerName} ({customer.customerCode})
              </option>
            ))}
          </select>

          <input
            placeholder="Мин. начальная стоимость"
            type="number"
            min="0"
            step="0.01"
            value={filter.minPrice}
            onChange={(e) => setFilter(prev => ({ ...prev, minPrice: e.target.value }))}
            style={inputStyle}
          />
        </Layout>

        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Макс. начальная стоимость"
            type="number"
            min="0"
            step="0.01"
            value={filter.maxPrice}
            onChange={(e) => setFilter(prev => ({ ...prev, maxPrice: e.target.value }))}
            style={inputStyle}
          />

          <select
            value={filter.currencyCode || ""}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              currencyCode: e.target.value
            }))}
            style={selectStyle}
          >
            <option value="">Все валюты</option>
            {currencyOptions.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <select
            value={filter.ndsRate || ""}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              ndsRate: e.target.value
            }))}
            style={selectStyle}
          >
            <option value="">Все НДС</option>
            {ndsOptions.map(nds => (
              <option key={nds} value={nds}>
                {nds}
              </option>
            ))}
          </select>
        </Layout>

        <Layout direction="row" gap="m" wrap={true} style={{ marginBottom: '10px' }}>
          <input
            placeholder="Фильтр по грузополучателю"
            value={filter.placeDelivery}
            onChange={(e) => setFilter(prev => ({ ...prev, placeDelivery: e.target.value }))}
            style={inputStyle}
          />

          <input
            type="datetime-local"
            placeholder="Дата доставки с"
            value={filter.dateDeliveryFrom}
            onChange={(e) => setFilter(prev => ({ ...prev, dateDeliveryFrom: e.target.value }))}
            style={inputStyle}
          />

          <input
            type="datetime-local"
            placeholder="Дата доставки по"
            value={filter.dateDeliveryTo}
            onChange={(e) => setFilter(prev => ({ ...prev, dateDeliveryTo: e.target.value }))}
            style={inputStyle}
          />
        </Layout>

        <Layout direction="row" gap="m">
          <Button label="Применить фильтры" onClick={loadLots} size="s" />
          <Button label="Сбросить фильтры" onClick={resetFilterHandler} size="s" view="secondary" />
        </Layout>

      </Card>


      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <Table
          rows={lots}
          columns={[
            {
              title: (
                <div style={{ cursor: 'pointer' }} onClick={() => sortLots('lotName')}>
                  Наименование
                  {sortConfig.key === 'lotName' && (
                    <span style={{ marginLeft: 4 }}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              ),
              accessor: 'lotName',
            },
            {
              title: 'Код контрагента',
              accessor: 'customerCode',
              renderCell: (row) => {
                const customer = customersSimple.find(c => c.customerCode === row.customerCode);
                return customer ? `${customer.customerName} (${customer.customerCode})` : row.customerCode || '-';
              },
            },
            {
              title: (
                <div style={{ cursor: 'pointer' }} onClick={() => sortLots('price')}>
                  Начальная стоимость
                  {sortConfig.key === 'price' && (
                    <span style={{ marginLeft: 4 }}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              ),
              accessor: 'price',
              renderCell: (row) => row.price ? `${parseFloat(row.price).toFixed(2)}` : '0.00',
            },
            {
              title: 'Валюта',
              accessor: 'currencyCode',
              renderCell: (row) => (
                <Tag
                  label={row.currencyCode || 'RUB'}
                  mode={row.currencyCode === 'RUB' ? 'info' : row.currencyCode === 'USD' ? 'warning' : 'success'}
                  size="s"
                />
              ),
            },
            {
              title: 'Код НДС',
              accessor: 'ndsRate',
              renderCell: (row) => (
                <Tag
                  label={row.ndsRate || 'Без НДС'}
                  mode={row.ndsRate === 'Без НДС' ? 'normal' : row.ndsRate === '18%' ? 'warning' : 'error'}
                  size="s"
                />
              ),
            },
            {
              title: 'Грузополучатель',
              accessor: 'placeDelivery',
              renderCell: (row) => row.placeDelivery || '-',
            },
            {
              title: (
                <div style={{ cursor: 'pointer' }} onClick={() => sortLots('dateDelivery')}>
                  Дата доставки
                  {sortConfig.key === 'dateDelivery' && (
                    <span style={{ marginLeft: 4 }}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              ),
              accessor: 'dateDelivery',
              renderCell: (row) => row.dateDelivery
                ? new Date(row.dateDelivery).toLocaleString('ru-RU', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                : '-',
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
                    onClick={() => handleDelete(row.lotName)}
                    size="s"
                    view="warning"
                  />
                </Layout>

              ),
            },
          ]}
          getRowId={(row) => row.lotName || row.id}
          size="s"
          zebraStriped="odd"
          emptyRowsPlaceholder={<div style={{ textAlign: 'center', padding: '20px' }}>Нет данных</div>}
        />
      )}
    </Layout>
  );
}

export default Lots;