using Microsoft.EntityFrameworkCore.Migrations;

public partial class AddSQLScriptValidationResultsTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "SQLScriptValidationResults",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                UploadedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                IsValid = table.Column<bool>(nullable: false),
                ValidationErrors = table.Column<string>(nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_SQLScriptValidationResults", x => x.Id);
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "SQLScriptValidationResults");
    }
}
