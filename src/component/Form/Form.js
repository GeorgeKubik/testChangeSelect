
import styles from './Form.module.scss';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

const Form = () => {
	const [reserve, setReserve] = useState([]);
	const [result, setResult] = useState([]);
	const [changeDateFrom, setChangeDateFrom] = useState('');
	const [changeDateTo, setChangeDateTo] = useState('');
	const [submit, setSubmit] = useState(true);
	const { register, handleSubmit, reset, formState: { errors } } = useForm();

	useEffect(() => {
		console.log(errors);
	}, [errors])

	useEffect(() => {
		console.log(JSON.stringify((reserve)));
	}, [reserve, setReserve])

	useEffect(() => {
		setSubmit(disabledBtn(changeDateFrom, changeDateTo));
	}, [changeDateFrom, changeDateTo])

	//проверка на заполнение даты и клик на отправку
	const disabledBtn = (changeDateFrom, changeDateTo) => (
		changeDateFrom === undefined ||
			changeDateTo === undefined ||
			changeDateFrom === '' ||
			changeDateTo === ''
			? false : true
	)

	const onSubmit = data => {
		setReserve(data);
		if (submit) {
			setResult(getValidateData(data));
			setSubmit(!submit);
			setChangeDateFrom('');
			setChangeDateTo('');
		}
		reset();
	};

	const handleChangeDateFrom = (e) => {
		setChangeDateFrom(e.target.value)
	}
	const handleChangeDateTo = (e) => {
		setChangeDateTo(e.target.value)
	}
	const handleClickReset = (e) => {
		if (e.target) {
			setSubmit(false);
			setChangeDateFrom('');
			setChangeDateTo('');
		}
	}

	//валидация данных
	const getValidateData = (data) => {
		const { tower,
			floor,
			meeting,
			timeFrom,
			timeTo,
			comment } = data;

		//if ()
		const dateFrom = timeFrom !== null ? new Date(timeFrom).getDate() : null;
		const dateTo = timeTo !== 0 ? new Date(timeTo).getDate() : null;
		const hoursFrom = timeFrom !== 0 ? new Date(timeFrom).getHours() : null;
		const hoursTo = timeTo !== 0 ? new Date(timeTo).getHours() : null;
		const minutesFrom = timeFrom !== 0 ? new Date(timeFrom).getMinutes() : null;
		const minutesTo = timeTo !== 0 ? new Date(timeTo).getMinutes() : null;

		const newObject = {
			tower,
			floor,
			meeting,
			dateFrom,
			dateTo,
			hoursFrom,
			hoursTo,
			minutesFrom,
			minutesTo,
			comment
		}
		result.push(newObject);
		return result;
	}
	//Вывели данные
	const viewResult = (result) => {

		const list = result.map((item, index) => {
			const {
				tower,
				floor,
				meeting,
				dateFrom,
				dateTo,
				hoursFrom,
				hoursTo,
				minutesFrom,
				minutesTo,
				comment
			} = item;
			
			return (
				<div key={index} className={styles.wrapperList}>
					<div className={styles.listItem}>Башная<br />  {tower}</div>
					<div className={styles.listItem}>Этаж<br />  {floor}</div>
					<div className={styles.listItem}>Переговорная<br />  {meeting}</div>
					{
						dateFrom === dateTo ? <div className={styles.listItem}>Дата:<br />{dateFrom} число</div> :
							<div className={styles.listItem}>
								Дата:<br /> с {dateFrom}  по {dateTo} число
							</div>
					}
					<div className={styles.listItem}>Время:<br /> с {hoursFrom}:{minutesFrom} по {hoursTo}:{minutesTo}</div>
					<div className={styles.listItem}>Комментарий:<br /> {comment}</div>
				</div>
			)
		})
		return (
			<div className={styles.wrapperViewResult}>
				{list}
			</div>
		)
	};
	const view = viewResult(result);

	//Получили список этажей
	const getOptionFloor = (countFloor) => {
		const arrOptionFloor = [];
		for (let index = 3; index <= countFloor; index++) {
			arrOptionFloor[index - 3] = index;
		}
		return arrOptionFloor;
	}
	const optionFloorArray = getOptionFloor(27);
	const optionFloorElement = optionFloorArray.map((option, index) => (
		<option
			key={index}
			value={option}
		>
			{option}
		</option>
	))

	//Получили список переговорок
	const getOptionMeeting = (numberOfMeetingRooms) => {
		const arrOptionsMeetingRooms = [];
		for (let i = 1; i <= numberOfMeetingRooms; i++) {
			arrOptionsMeetingRooms[i - 1] = i;
		}
		return arrOptionsMeetingRooms;
	}

	const optionMeetingArray = getOptionMeeting(10);
	const optionMeetingElement = optionMeetingArray.map((option, index) => {
		return (
			<option
				key={index}
				value={option}
			>
				{option}
			</option>
		)
	})

	const form = (
		<form className={styles.wrapperForm} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.selectWrapper}>
				<select className={styles.select}
					required
					{...register("tower", { required: true })}
				>
					<option value="Выбор">Выбор</option>
					<option value="А">А</option>
					<option value="Б">Б</option>
				</select>
				<select className={styles.select}
					{...register("floor", { required: true })}
				>
					<option value="Выбор">Выбор</option>
					{optionFloorElement}
				</select>
				<select
					className={styles.select}
					{...register("meeting", { required: true })}
				>
					<option value="Выбор">Выбор</option>
					{optionMeetingElement}
				</select>
			</div>
			<div className={styles.inputWrapper}>
				<input  {...register("timeFrom", { required: true })}
					className={styles.inputBox}
					type="datetime-local"
					onChange={handleChangeDateFrom}

				/>
				<input  {...register("timeTo", { required: true })}
					className={styles.inputBox}
					type="datetime-local"
					onChange={handleChangeDateTo}
				/>
			</div>
			<textarea
				className={styles.textArea}
				{...register("comment", {})}
				type='text'
				rows="5" cols="45" maxLength="100"
			/>

			<div className={styles.btnWrapper}>
				<button className={styles.btnSubmit}
					type="submit"
					disabled={!submit}
					style={submit ? { background: `rgb(87, 115, 208)` } : { background: `rgb(222, 226, 255)` }}
				>
					Отправить
				</button>
				<input
					className={styles.btnResetForm}
					type="reset"
					value="Очистить"
					onClick={(e) => handleClickReset(e)}
				/>
			</div>
		</form>
	)
	return (
		<>
			<div className={styles.wrapper}>
				{form}
				{view}
			</div>
		</>
	);
}

export default Form;