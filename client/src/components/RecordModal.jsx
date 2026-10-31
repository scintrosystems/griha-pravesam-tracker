import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';

export default function RecordModal({
    show,
    onClose,
    itemToEdit,
    activeTabSlug,
    tabs,
    lookups,
    allItems = [], // 👈 Access to all existing items to pull contacts from Contact Directory!
    onItemSaved,
    onOpenLookupModal
}) {
    const [tabSlug, setTabSlug] = useState(activeTabSlug || 'schedule');

    // Common
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [locationId, setLocationId] = useState('');
    const [inChargeId, setInChargeId] = useState('');
    const [transportModeId, setTransportModeId] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Confirmed');

    // Financials
    const [totalCost, setTotalCost] = useState('');
    const [paidAmount, setPaidAmount] = useState('');

    // Food & Catering
    const [hotelDetails, setHotelDetails] = useState('');
    const [mealType, setMealType] = useState('Breakfast');
    const [menuItems, setMenuItems] = useState('');
    const [headcount, setHeadcount] = useState('');
    const [bookedBy, setBookedBy] = useState('');

    // Rooms
    const [roomCount, setRoomCount] = useState('');
    const [headcountPerRoom, setHeadcountPerRoom] = useState('');
    const [roomTariff, setRoomTariff] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');
    const [hotelContact, setHotelContact] = useState('');

    // Vehicles
    const [travelsDetails, setTravelsDetails] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [driverNumber, setDriverNumber] = useState('');
    const [rentPerDay, setRentPerDay] = useState('');
    const [kmRate, setKmRate] = useState('');
    const [additionalCharges, setAdditionalCharges] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [route, setRoute] = useState('');

    // Purchase List
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Poojai');
    const [quantity, setQuantity] = useState('');
    const [specifics, setSpecifics] = useState('');
    const [purchasedFrom, setPurchasedFrom] = useState('');

    // Contacts
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');

    // Custom Data
    const [customData, setCustomData] = useState({});

    useEffect(() => {
        if (itemToEdit) {
            setTabSlug(itemToEdit.tabSlug);
            setTitle(itemToEdit.title || '');
            setDate(itemToEdit.date || '');
            setStartTime(itemToEdit.startTime || '');
            setEndTime(itemToEdit.endTime || '');
            setLocationId(itemToEdit.location?._id || itemToEdit.location || '');
            setInChargeId(itemToEdit.inCharge?._id || itemToEdit.inCharge || '');
            setTransportModeId(itemToEdit.transportMode?._id || itemToEdit.transportMode || '');
            setDescription(itemToEdit.description || '');
            setStatus(itemToEdit.status || 'Confirmed');

            setTotalCost(itemToEdit.totalCost || itemToEdit.amount || '');
            setPaidAmount(itemToEdit.paidAmount || '');

            setHotelDetails(itemToEdit.hotelDetails || '');
            setMealType(itemToEdit.mealType || 'Breakfast');
            setMenuItems(itemToEdit.menuItems || '');
            setHeadcount(itemToEdit.headcount || '');
            setBookedBy(itemToEdit.bookedBy || '');

            setRoomCount(itemToEdit.roomCount || '');
            setHeadcountPerRoom(itemToEdit.headcountPerRoom || '');
            setRoomTariff(itemToEdit.roomTariff || '');
            setCheckInDate(itemToEdit.checkInDate || '');
            setCheckInTime(itemToEdit.checkInTime || '');
            setCheckOutDate(itemToEdit.checkOutDate || '');
            setCheckOutTime(itemToEdit.checkOutTime || '');
            setHotelContact(itemToEdit.hotelContact || '');

            setTravelsDetails(itemToEdit.travelsDetails || '');
            setVehicleModel(itemToEdit.vehicleModel || '');
            setDriverNumber(itemToEdit.driverNumber || '');
            setRentPerDay(itemToEdit.rentPerDay || '');
            setKmRate(itemToEdit.kmRate || '');
            setAdditionalCharges(itemToEdit.additionalCharges || '');
            setPickupTime(itemToEdit.pickupTime || '');
            setRoute(itemToEdit.route || '');

            setAmount(itemToEdit.amount || '');
            setCategory(itemToEdit.category || 'Poojai');
            setQuantity(itemToEdit.quantity || '');
            setSpecifics(itemToEdit.specifics || '');
            setPurchasedFrom(itemToEdit.purchasedFrom || '');

            setPhone(itemToEdit.phone || '');
            setRole(itemToEdit.role || '');
            setCustomData(itemToEdit.customData || {});
        } else {
            const defaultSlug = (activeTabSlug === 'dayview' || !activeTabSlug) ? 'schedule' : activeTabSlug;
            setTabSlug(defaultSlug);
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setStartTime('');
            setEndTime('');
            setLocationId('');
            setInChargeId('');
            setTransportModeId('');
            setDescription('');
            setStatus('Confirmed');

            setTotalCost('');
            setPaidAmount('');

            setHotelDetails('');
            setMealType('Breakfast');
            setMenuItems('');
            setHeadcount('');
            setBookedBy('');

            setRoomCount('');
            setHeadcountPerRoom('');
            setRoomTariff('');
            setCheckInDate('');
            setCheckInTime('');
            setCheckOutDate('');
            setCheckOutTime('');
            setHotelContact('');

            setTravelsDetails('');
            setVehicleModel('');
            setDriverNumber('');
            setRentPerDay('');
            setKmRate('');
            setAdditionalCharges('');
            setPickupTime('');
            setRoute('');

            setAmount('');
            setCategory('Poojai');
            setQuantity('');
            setSpecifics('');
            setPurchasedFrom('');

            setPhone('');
            setRole('');
            setCustomData({});
        }
    }, [itemToEdit, activeTabSlug, show]);

    if (!show) return null;

    const currentTab = tabs.find(t => t.slug === tabSlug);
    const isCustomTab = currentTab?.isCustom;
    const isPurchaseTab = tabSlug === 'purchase' || tabSlug === 'shopping';

    // 1. Locations from Master Dropdowns
    const locations = lookups.filter(l => l.type === 'LOCATION');
    const transportModes = lookups.filter(l => l.type === 'TRANSPORT_MODE');
    const masterMenuItems = lookups.filter(l => l.type === 'MENU_ITEM');

    // 2. Contacts fetched directly from the Contact Directory Tab!
    const directoryContacts = allItems.filter(i => i.tabSlug === 'contacts');

    const handleAppendMenuItem = (dishName) => {
        if (!dishName) return;
        setMenuItems(prev => prev ? `${prev}, ${dishName}` : dishName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let computedTitle = title;
        if (tabSlug === 'food') computedTitle = `${mealType} - ${hotelDetails.split(',')[0] || 'Meal'}`;
        if (tabSlug === 'rooms') computedTitle = hotelDetails.split(',')[0] || title || 'Room Stay';
        if (tabSlug === 'vehicles') computedTitle = `${vehicleModel || 'Vehicle'} (${travelsDetails.split(',')[0] || 'Travels'})`;

        let timeSlot = '';
        if (startTime && endTime) timeSlot = `${startTime} – ${endTime}`;
        else if (startTime) timeSlot = `${startTime} onwards`;

        const numTotal = Number(String(totalCost).replace(/[^0-9.]/g, '')) || 0;
        const numPaid = Number(String(paidAmount).replace(/[^0-9.]/g, '')) || 0;
        const paymentStatus = numPaid >= numTotal && numTotal > 0 ? 'Paid' : numPaid > 0 ? 'Partial' : 'Unpaid';

        const payload = {
            tabSlug,
            title: computedTitle || 'Untitled Record',
            date,
            startTime,
            endTime,
            timeSlot: pickupTime || timeSlot,
            location: locationId || null,
            inCharge: inChargeId || null,
            transportMode: transportModeId || null,
            description,
            status,

            totalCost: numTotal,
            paidAmount: numPaid,
            paymentStatus,

            hotelDetails,
            mealType,
            menuItems,
            headcount,
            bookedBy,

            roomCount,
            headcountPerRoom,
            roomTariff,
            checkInDate,
            checkInTime,
            checkOutDate,
            checkOutTime,
            hotelContact,

            travelsDetails,
            vehicleModel,
            driverNumber,
            rentPerDay,
            kmRate,
            additionalCharges,
            pickupTime,
            route,

            amount: amount || totalCost,
            category: isPurchaseTab ? category : '',
            quantity,
            specifics,
            purchasedFrom,

            phone,
            role,
            customData
        };

        try {
            if (itemToEdit?._id) {
                await API.put(`/items/${itemToEdit._id}`, payload);
            } else {
                await API.post('/items', payload);
            }
            onItemSaved();
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save record');
        }
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-modern" style={{ maxWidth: '720px' }}>
                <div className="modal-header-modern">
                    <div className="d-flex align-items-center gap-2">
                        <div className="header-icon">
                            <i className="bi bi-calendar2-plus-fill"></i>
                        </div>
                        <div>
                            <h6 className="header-title">{itemToEdit ? 'Edit Record' : 'Add New Record'}</h6>
                            <span className="text-muted small">
                                Section: <strong>{currentTab?.label || 'General'}</strong>
                            </span>
                        </div>
                    </div>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1 overflow-hidden">
                    <div className="p-3 overflow-y-auto flex-grow-1" style={{ maxHeight: '72vh' }}>

                        {/* Target Tab Selector */}
                        <div className="mb-3">
                            <label className="modal-label">Target Section / Tab *</label>
                            <select className="modal-select w-100" value={tabSlug} onChange={(e) => setTabSlug(e.target.value)} required>
                                {tabs.map(t => (
                                    <option key={t.slug} value={t.slug}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* 1. EVENT AGENDA */}
                        {tabSlug === 'schedule' && (
                            <>
                                <div className="mb-2.5">
                                    <label className="modal-label">Agenda Title *</label>
                                    <input type="text" className="modal-input w-100" placeholder="e.g. Ganapathy Homam, Evening Celebrations" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-calendar3"></i> Date *</label>
                                        <input type="date" className="modal-input w-100" value={date} onChange={(e) => setDate(e.target.value)} required />
                                    </div>
                                    <div className="col-6 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-clock"></i> Start Time</label>
                                        <input type="time" className="modal-input w-100" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                    <div className="col-6 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-clock-fill"></i> End Time</label>
                                        <input type="time" className="modal-input w-100" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-geo-alt"></i> Location</label>
                                        <div className="modal-input-group">
                                            <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                                <option value="">— Select Location —</option>
                                                {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                            </select>
                                            <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-car-front"></i> Transport Mode</label>
                                        <div className="modal-input-group">
                                            <select className="modal-select" value={transportModeId} onChange={(e) => setTransportModeId(e.target.value)}>
                                                <option value="">— Optional —</option>
                                                {transportModes.map(t => (<option key={t._id} value={t._id}>{t.name}</option>))}
                                            </select>
                                            <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>

                                    {/* In-Charge Person from Contact Directory */}
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-person"></i> In-Charge Person</label>
                                        <select className="modal-select w-100" value={inChargeId} onChange={(e) => setInChargeId(e.target.value)}>
                                            <option value="">— Select from Contacts —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 2. FOOD & CATERING */}
                        {tabSlug === 'food' && (
                            <>
                                <div className="mb-2.5">
                                    <label className="modal-label">Hotel / Caterer Name with Address & Contact *</label>
                                    <input type="text" className="modal-input w-100" placeholder="e.g. Appans Hotel, Sivakasi (Ph: 98401 22334)" value={hotelDetails} onChange={(e) => setHotelDetails(e.target.value)} required />
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-calendar3"></i> Date *</label>
                                        <input type="date" className="modal-input w-100" value={date} onChange={(e) => setDate(e.target.value)} required />
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label">Meal Type</label>
                                        <select className="modal-select w-100" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                            <option value="Breakfast">Breakfast / Tiffen</option>
                                            <option value="Lunch">Lunch (Feast)</option>
                                            <option value="Snack">Evening Snack & Tea</option>
                                            <option value="Dinner">Traditional Dinner</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-clock"></i> Timing</label>
                                        <input type="time" className="modal-input w-100" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-geo-alt"></i> Dining Location</label>
                                        <div className="modal-input-group">
                                            <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                                <option value="">— Select Location —</option>
                                                {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                            </select>
                                            <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4">
                                        <label className="modal-label">Headcount</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. 60 Members" value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
                                    </div>
                                    {/* Booked By from Contact Directory */}
                                    <div className="col-6 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-person-check"></i> Booked By</label>
                                        <select className="modal-select w-100" value={bookedBy} onChange={(e) => setBookedBy(e.target.value)}>
                                            <option value="">— Select Contact —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c.title}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-2.5">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <label className="modal-label mb-0"><i className="bi bi-egg-fried"></i> Menu Items</label>
                                        <div className="d-flex align-items-center gap-1">
                                            <span className="small text-muted" style={{ fontSize: '11px' }}>Quick Pick:</span>
                                            <select
                                                className="modal-select py-0 px-1"
                                                style={{ fontSize: '11px', height: '24px' }}
                                                onChange={(e) => {
                                                    handleAppendMenuItem(e.target.value);
                                                    e.target.value = '';
                                                }}
                                            >
                                                <option value="">+ Add Dish</option>
                                                {masterMenuItems.map(m => (
                                                    <option key={m._id} value={m.name}>{m.name}</option>
                                                ))}
                                            </select>
                                            <button type="button" className="btn btn-sm btn-link text-amber p-0" title="Manage Dishes" onClick={onOpenLookupModal}>
                                                <i className="bi bi-gear"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        rows="2"
                                        className="modal-input w-100"
                                        placeholder="e.g. Idiyappam, Idli, Pongal, Coffee"
                                        value={menuItems}
                                        onChange={(e) => setMenuItems(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Catering Contact Person from Directory */}
                                <div className="mb-2.5">
                                    <label className="modal-label"><i className="bi bi-person"></i> Catering Contact Person</label>
                                    <select className="modal-select w-100" value={inChargeId} onChange={(e) => setInChargeId(e.target.value)}>
                                        <option value="">— Select Contact —</option>
                                        {directoryContacts.map(c => (
                                            <option key={c._id} value={c._id}>
                                                {c.title} {c.phone ? `(${c.phone})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* 3. ROOMS & LODGING */}
                        {tabSlug === 'rooms' && (
                            <>
                                <div className="mb-2.5">
                                    <label className="modal-label">Hotel Name with Address & Contact *</label>
                                    <input type="text" className="modal-input w-100" placeholder="e.g. Sri Kaliswari Le Archids, Sivakasi" value={hotelDetails} onChange={(e) => setHotelDetails(e.target.value)} required />
                                </div>

                                <div className="mb-2.5">
                                    <label className="modal-label"><i className="bi bi-geo-alt"></i> Location (Google Maps)</label>
                                    <div className="modal-input-group">
                                        <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                            <option value="">— Select Location —</option>
                                            {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                        </select>
                                        <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-6 col-sm-4">
                                        <label className="modal-label">Room Count</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. 3 Rooms" value={roomCount} onChange={(e) => setRoomCount(e.target.value)} />
                                    </div>
                                    <div className="col-6 col-sm-4">
                                        <label className="modal-label">Headcount per Room</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. 2 Max, Extra 1" value={headcountPerRoom} onChange={(e) => setHeadcountPerRoom(e.target.value)} />
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label">Tariff & Details</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. ₹2200+GST/room" value={roomTariff} onChange={(e) => setRoomTariff(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5 p-2 bg-light rounded border">
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-calendar-check"></i> Check-in Date</label>
                                        <input type="date" className="modal-input w-100" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-clock"></i> Check-in Time</label>
                                        <input type="time" className="modal-input w-100" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5 p-2 bg-light rounded border">
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-calendar-x"></i> Check-out Date</label>
                                        <input type="date" className="modal-input w-100" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-clock"></i> Check-out Time</label>
                                        <input type="time" className="modal-input w-100" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    {/* In-Charge from Contact Directory */}
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-person"></i> In-Charge / Contact Person</label>
                                        <select className="modal-select w-100" value={inChargeId} onChange={(e) => setInChargeId(e.target.value)}>
                                            <option value="">— Select Contact —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Booked By from Contact Directory */}
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-person-check"></i> Booked By</label>
                                        <select className="modal-select w-100" value={bookedBy} onChange={(e) => setBookedBy(e.target.value)}>
                                            <option value="">— Select Contact —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c.title}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 4. VEHICLES & TAXIS (Driver Dropdown from Contacts) */}
                        {tabSlug === 'vehicles' && (
                            <>
                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Travels Name with Address & Contact *</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Sri Annai Tours, Virudhunagar" value={travelsDetails} onChange={(e) => setTravelsDetails(e.target.value)} required />
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Vehicle Model *</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Force Urbania (14 Seater)" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    {/* Driver Dropdown from Contact Directory */}
                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-person-badge"></i> Driver (from Contacts)</label>
                                        <select
                                            className="modal-select w-100"
                                            value={driverNumber}
                                            onChange={(e) => setDriverNumber(e.target.value)}
                                        >
                                            <option value="">— Select Driver —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c.phone || c.title}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-geo-alt"></i> Pickup Location</label>
                                        <div className="modal-input-group">
                                            <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                                <option value="">— Select Location —</option>
                                                {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                            </select>
                                            <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <label className="modal-label"><i className="bi bi-calendar3"></i> Booking Date</label>
                                        <input type="date" className="modal-input w-100" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-4">
                                        <label className="modal-label">Rent / Day</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. ₹7500/day" value={rentPerDay} onChange={(e) => setRentPerDay(e.target.value)} />
                                    </div>
                                    <div className="col-4">
                                        <label className="modal-label">KM Rate</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. ₹25/KM" value={kmRate} onChange={(e) => setKmRate(e.target.value)} />
                                    </div>
                                    <div className="col-4">
                                        <label className="modal-label">Extra Charges</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Tolls / Batta" value={additionalCharges} onChange={(e) => setAdditionalCharges(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-clock"></i> Pickup Time</label>
                                        <input type="time" className="modal-input w-100" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="modal-label">Route</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Virudhunagar to Sivakasi" value={route} onChange={(e) => setRoute(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 5. PURCHASE LIST */}
                        {isPurchaseTab && (
                            <>
                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Parent Category *</label>
                                        <select
                                            className="modal-select w-100 fw-bold"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value="Poojai">🪔 Poojai Items</option>
                                            <option value="General">🛍️ General Provisions & Gifts</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Item / Checklist Name *</label>
                                        <input
                                            type="text"
                                            className="modal-input w-100"
                                            placeholder="e.g. Salt (Uppu), Vilakku Thiri, Return Bags"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-6">
                                        <label className="modal-label">Quantity</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. 2 Pkts / 100ml" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="modal-label">Specifics</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Big Size / Pure Cotton" value={specifics} onChange={(e) => setSpecifics(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-shop"></i> Purchased From (Shop / Source)</label>
                                        <input
                                            type="text"
                                            className="modal-input w-100"
                                            placeholder="e.g. Local Market, Supermarket"
                                            value={purchasedFrom}
                                            onChange={(e) => setPurchasedFrom(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-person"></i> Assigned Person</label>
                                        <select className="modal-select w-100" value={inChargeId} onChange={(e) => setInChargeId(e.target.value)}>
                                            <option value="">— Select Contact —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 6. TO-DO TASKS */}
                        {tabSlug === 'todo' && (
                            <>
                                <div className="mb-2.5">
                                    <label className="modal-label">Task Description *</label>
                                    <input type="text" className="modal-input w-100" placeholder="e.g. Iyer Kalidass Balance Payment envelope ready" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-calendar3"></i> Deadline Date</label>
                                        <input type="date" className="modal-input w-100" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="modal-label"><i className="bi bi-clock"></i> Deadline Time</label>
                                        <input type="time" className="modal-input w-100" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-geo-alt"></i> Location</label>
                                        <div className="modal-input-group">
                                            <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                                <option value="">— Select Location —</option>
                                                {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                            </select>
                                            <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-person"></i> Assigned Person</label>
                                        <select className="modal-select w-100" value={inChargeId} onChange={(e) => setInChargeId(e.target.value)}>
                                            <option value="">— Select Contact —</option>
                                            {directoryContacts.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.title} {c.phone ? `(${c.phone})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 7. CONTACT DIRECTORY */}
                        {tabSlug === 'contacts' && (
                            <>
                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Contact Name *</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Soundararajan K P" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Phone Number *</label>
                                        <input type="tel" className="modal-input w-100" placeholder="e.g. 93601 88819" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="row g-2 mb-2.5">
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label">Role (Text Input)</label>
                                        <input type="text" className="modal-input w-100" placeholder="e.g. Driver, Iyer, Caterer, Hotel Manager" value={role} onChange={(e) => setRole(e.target.value)} />
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <label className="modal-label"><i className="bi bi-geo-alt"></i> Location</label>
                                        <div className="modal-input-group">
                                            <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                                <option value="">— Select Location —</option>
                                                {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                            </select>
                                            <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 8. CUSTOM TABS */}
                        {isCustomTab && (
                            <>
                                <div className="mb-2.5">
                                    <label className="modal-label">Title / Name *</label>
                                    <input type="text" className="modal-input w-100" placeholder="Item or Activity Name" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                {currentTab?.customFields?.map(field => {
                                    if (field.key === 'date') {
                                        return (
                                            <div key={field.key} className="mb-2.5">
                                                <label className="modal-label"><i className="bi bi-calendar3"></i> {field.label}</label>
                                                <input type="date" className="modal-input w-100" value={date} onChange={(e) => setDate(e.target.value)} />
                                            </div>
                                        );
                                    }
                                    if (field.key === 'time') {
                                        return (
                                            <div key={field.key} className="row g-2 mb-2.5">
                                                <div className="col-6">
                                                    <label className="modal-label"><i className="bi bi-clock"></i> Start Time</label>
                                                    <input type="time" className="modal-input w-100" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                                </div>
                                                <div className="col-6">
                                                    <label className="modal-label"><i className="bi bi-clock-fill"></i> End Time</label>
                                                    <input type="time" className="modal-input w-100" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    if (field.key === 'location') {
                                        return (
                                            <div key={field.key} className="mb-2.5">
                                                <label className="modal-label"><i className="bi bi-geo-alt"></i> Location</label>
                                                <div className="modal-input-group">
                                                    <select className="modal-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                                        <option value="">— Select Location —</option>
                                                        {locations.map(loc => (<option key={loc._id} value={loc._id}>{loc.name}</option>))}
                                                    </select>
                                                    <button type="button" className="btn-addon-add" onClick={onOpenLookupModal}><i className="bi bi-plus-lg"></i></button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    if (field.key === 'inCharge') {
                                        return (
                                            <div key={field.key} className="mb-2.5">
                                                <label className="modal-label"><i className="bi bi-person"></i> In-Charge / Person</label>
                                                <select className="modal-select w-100" value={inChargeId} onChange={(e) => setInChargeId(e.target.value)}>
                                                    <option value="">— Select Contact —</option>
                                                    {directoryContacts.map(c => (
                                                        <option key={c._id} value={c._id}>
                                                            {c.title} {c.phone ? `(${c.phone})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={field.key} className="mb-2.5">
                                            <label className="modal-label">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                className="modal-input w-100"
                                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                                value={customData[field.key] || ''}
                                                onChange={(e) => setCustomData({ ...customData, [field.key]: e.target.value })}
                                            />
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {/* EXPENSES (Hidden on Contacts AND Purchase Items) */}
                        {tabSlug !== 'contacts' && tabSlug !== 'purchase' && tabSlug !== 'shopping' && (
                            <div className="p-2.5 mb-2.5 rounded-3 border bg-light">
                                <span className="modal-label mb-1.5"><i className="bi bi-currency-rupee"></i> Expenses & Payment:</span>
                                <div className="row g-2 align-items-center">
                                    <div className="col-12 col-sm-4">
                                        <label className="text-muted small d-block mb-1">Total Bill / Cost (₹)</label>
                                        <input
                                            type="number"
                                            className="modal-input w-100"
                                            placeholder="e.g. 5000"
                                            value={totalCost}
                                            onChange={(e) => setTotalCost(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <label className="text-muted small d-block mb-1">Paid / Advance (₹)</label>
                                        <input
                                            type="number"
                                            className="modal-input w-100"
                                            placeholder="e.g. 2000"
                                            value={paidAmount}
                                            onChange={(e) => setPaidAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-4">
                                        <label className="text-muted small d-block mb-1">Balance Due</label>
                                        <div className="balance-display-box">
                                            ₹{Math.max(0, (Number(totalCost) || 0) - (Number(paidAmount) || 0)).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-2.5">
                            <label className="modal-label"><i className="bi bi-card-text"></i> Description</label>
                            <textarea rows="2" className="modal-input w-100" placeholder="Detailed instructions, specifics, or notes..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>

                        {/* Status (Hidden on Contacts) */}
                        {tabSlug !== 'contacts' && (
                            <div>
                                <label className="modal-label"><i className="bi bi-check-circle"></i> Status</label>
                                <select className="modal-select w-100" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer-modern">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">
                            {itemToEdit ? 'Save Changes' : 'Create Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}