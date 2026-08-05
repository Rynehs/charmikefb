export default function RecentActivityTable({
  columns,
  rows,
}) {
  return (
    <table className="w-full">

      <thead>

        <tr className="border-b">

          {columns.map((column) => (
            <th
              key={column}
              className="py-3 text-left text-sm font-semibold"
            >
              {column}
            </th>
          ))}

        </tr>

      </thead>

      <tbody>

        {rows.map((row, index) => (

          <tr
            key={index}
            className="border-b last:border-none"
          >

            {row.map((cell, i) => (
              <td
                key={i}
                className="py-4 text-sm"
              >
                {cell}
              </td>
            ))}

          </tr>

        ))}

      </tbody>

    </table>
  );
}